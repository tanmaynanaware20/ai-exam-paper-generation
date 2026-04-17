import db from '../db.js';

export const createHistory = async (req, res) => {
  try {
    const { prompt, generated_text } = req.body;

    if (!prompt || !generated_text) {
      return res.status(400).json({
        error: 'Prompt and generated_text are required'
      });
    }

    await db.query(
      'INSERT INTO generated_papers(prompt, generated_text) VALUES($1,$2)',
      [prompt, generated_text]
    );

    res.json({
      message: 'Created successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
export const getHistory = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM generated_papers ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM generated_papers WHERE id=$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'History not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updateHistory = async (req, res) => {
  try {
    const { id, prompt, generated_text } = req.body;
    if (!id) {
  return res.status(400).json({
    error: 'Id is required'
  });
}

    await db.query(
      'UPDATE generated_papers SET prompt=$1, generated_text=$2 WHERE id=$3',
      [prompt, generated_text, id]
    );

    res.json({
      message: 'Updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
  return res.status(400).json({
    error: 'Id is required'
  });
}

    await db.query(
      'DELETE FROM generated_papers WHERE id=$1',
      [id]
    );

    res.json({
      message: 'Deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};