const pool = require('../../database/connection');

const getNotification = (req,res) => {
    const {id} = req.params;
    if(!id){
        res.status(400).json({message:'id is required'})
    }
    pool.query('SELECT * FROM notifications WHERE user_id = $1 AND is_read = false', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
});
}
const updateNotification = (req,res) => {
    const {id} = req.params;
    if(!id){
        res.status(400).json({message:'id is required'})
    }
    pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [id], (error, results) => {
        if (error) {
            return res.status(400).json({message:'notification not updated'});
        }
        res.status(200).json({message:'notification updated'});
});
}
module.exports = {getNotification,updateNotification};