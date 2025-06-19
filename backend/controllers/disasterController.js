const { extractLocationFromText } = require('../services/geminiService');
const { geocodeLocation } = require('../services/geocodingService');
const { supabase } = require('../supabase/client');

// Create a new disaster (persistent)
const createDisaster = async (req, res) => {
    const { title, location_name, description, tags } = req.body;

    const newDisaster = {
        title,
        location_name,
        description,
        tags,
        owner_id: 'netrunnerX',
        created_at: new Date().toISOString(),
        audit_trail: [
            {
                action: 'create',
                user_id: 'netrunnerX',
                timestamp: new Date().toISOString(),
            },
        ],
    };

    const { data, error } = await supabase.from('disasters').insert([newDisaster]).select();

    if (error) {
        console.error('Create disaster error:', error.message);
        return res.status(500).json({ error: 'Failed to create disaster' });
    }

    req.io?.emit('disaster_updated', data[0]);
    res.status(201).json(data[0]);
};

// Get disasters (optional tag filter)
const getDisasters = async (req, res) => {
    const { tag } = req.query;

    let query = supabase.from('disasters').select('*');

    if (tag) {
        query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Get disasters error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch disasters' });
    }

    res.json(data);
};

// Update a disaster
const updateDisaster = async (req, res) => {
    const { id } = req.params;
    const { title, location_name, description, tags } = req.body;

    const { data: current, error: getError } = await supabase.from('disasters').select('*').eq('id', id).single();
    if (getError || !current) return res.status(404).json({ error: 'Disaster not found' });

    const updatedAudit = [
        ...(current.audit_trail || []),
        {
            action: 'update',
            user_id: 'netrunnerX',
            timestamp: new Date().toISOString(),
        },
    ];

    const { data, error } = await supabase
        .from('disasters')
        .update({ title, location_name, description, tags, audit_trail: updatedAudit })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Update disaster error:', error.message);
        return res.status(500).json({ error: 'Failed to update disaster' });
    }

    req.io?.emit('disaster_updated', data[0]);
    res.json(data[0]);
};

// Delete disaster
const deleteDisaster = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('disasters').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Delete failed' });

    req.io?.emit('disaster_updated', { deleted_id: id });
    res.status(204).send();
};

// Location Extraction + Geocoding
const extractAndGeocode = async (req, res) => {
    const { description } = req.body;

    try {
        const locationName = await extractLocationFromText(description);
        if (!locationName) return res.status(400).json({ error: 'Location not found' });

        const coords = await geocodeLocation(locationName);
        if (!coords) return res.status(400).json({ error: 'Failed to geocode' });

        res.json({ location_name: locationName, coordinates: coords });
    } catch (err) {
        console.error('Geocode error:', err.message);
        res.status(500).json({ error: 'Internal error' });
    }
};

// Get nearby resources using Supabase/PostGIS
const getNearbyResources = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });

    const { data, error } = await supabase.rpc('nearby_resources', {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        radius: 10000,
    });

    if (error) {
        console.error('Geospatial error:', error.message);
        return res.status(500).json({ error: 'Geospatial query failed' });
    }

    req.io?.emit('resources_updated', data);
    res.json(data);
};

// Create report (used for social posts)
const createReport = async (req, res) => {
    const { id } = req.params;
    const { user_id, content, image_url } = req.body;

    const report = {
        disaster_id: id,
        user_id: user_id || 'citizen1',
        content,
        image_url,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('reports').insert([report]).select();

    if (error) {
        console.error('Create report error:', error.message);
        return res.status(500).json({ error: 'Failed to create report' });
    }

    req.io?.emit('social_media_updated', { disaster_id: id, posts: data });
    res.status(201).json(data[0]);
};

// Fetch reports for a disaster
const getReports = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase.from('reports').select('*').eq('disaster_id', id);

    if (error) {
        console.error('Get reports error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.json(data);
};

// Image verification with Gemini (mocked)
const verifyImage = async (req, res) => {
    const { id } = req.params;
    const { image_url } = req.body;

    const result = {
        image_url,
        verification_status: 'likely authentic',
        analyzed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('reports')
        .update({ verification_status: result.verification_status })
        .eq('disaster_id', id)
        .eq('image_url', image_url)
        .select();

    if (error) {
        console.error('Image verification update error:', error.message);
        return res.status(500).json({ error: 'Failed to update verification status' });
    }

    req.io?.emit('image_verified', result);
    res.json(result);
};

const submitSocialPost = (req, res) => {
    const { id } = req.params;
    const { post, user, type } = req.body;

    const newPost = {
        post,
        user,
        type,
        created_at: new Date().toISOString()
    };

    // If you're using in-memory mock:
    const mockPosts = [newPost]; // In real use, push to DB or array

    req.io?.emit('social_media_updated', {
        disaster_id: id,
        posts: mockPosts
    });

    res.status(201).json({ success: true });
};


module.exports = {
    createDisaster,
    getDisasters,
    updateDisaster,
    deleteDisaster,
    extractAndGeocode,
    getNearbyResources,
    createReport,
    getReports,
    verifyImage,
    submitSocialPost,
};
