const pool = require('../../database/connection');
const getCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await pool.query(
      'SELECT * FROM event_categories'
    );
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

const addCategory = async (req, res) => {
    const {
        name,
    description,
    parent_category_id} = req.body;
    try {
        // Insert new category into the database
        const result = await pool.query('INSERT INTO event_categories (name, description, parent_category_id) VALUES ($1, $2, $3) RETURNING *', [name, description, parent_category_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch category by ID from the database
        const result = await pool.query('SELECT * FROM event_categories WHERE category_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, parent_category_id } = req.body;
    try {
        // Update category in the database
        const result = await pool.query('UPDATE event_categories SET name = $1, description = $2, parent_category_id = $3 WHERE category_id = $4 RETURNING *', [name, description, parent_category_id, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }   
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete category from the database
        const result = await pool.query('DELETE FROM event_categories WHERE category_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

module.exports = {getCategories, addCategory, getCategoryById, updateCategory, deleteCategory};