const reportWebhook = process.env.DISCORD_WEBHOOK_REPORT_URL;
const upgradeWebhook = process.env.DISCORD_WEBHOOK_UPGRADE_URL;

// Send a feedback 
const feedback = async (req : any, res : any) => {
    try {
        const requestData = {
            ...req.body
        };
        const url = requestData.type === 'report' ? reportWebhook : upgradeWebhook;
        if (!url) {
            res.status(500).json({success: false, message: 'Webhook URL not configured'});
            return;
        }
        const title = requestData.type === 'report' ? "Nouveau bug signalé" : "Nouvelle amélioration proposée";
        const color = requestData.type === 'report' ? 15158332 : 3066993;
        const field = requestData.type === 'report' ? "Signalé par" : "Proposé par";
        const newRequestBody = {
            embeds : [{
                title : title,
                description : requestData.content,
                color : color,
                fields : [{
                    name : field,
                    value : requestData.pseudo ? requestData.pseudo : "Non fourni",
                    inline : true
                }],
                timestamp : new Date().toISOString()
            }]
        }
        const newRequestOption = {
            method : 'POST',
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify(newRequestBody)
        }
        await fetch(url, newRequestOption);
        res.status(201).json({success : true});
    } catch (err) {
        const error = err as Error;
        res.status(409).json({success : false, message : error.message});
    }
}

module.exports.feedback = feedback;