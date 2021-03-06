const express = require('express');

const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title, url, description, user_id: req.user.id
    }
    console.log(req.body);
    try {
        // const rta = pool.query(`INSERT INTO links (title, url, description, user_id) VALUES ('${title}', '${url}', '${description}', ${1});`);
        const rta = await pool.query('INSERT INTO links set ?', [newLink]);
        req.flash('success', 'Link saved successfully');
        res.redirect('/links');
    } catch (error) {
        console.error(error);
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
        res.render('links/list', { links });
    } catch (error) {
        console.error(error);
    }

});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        // const deleteLink = await pool.query(`DELETE FROM links WHERE id = ${id};`);
        await pool.query('DELETE FROM links WHERE id = ?', [id]);
        req.flash('success', 'Link removed successfully');
        res.redirect('/links');
    } catch (error) {
        console.error(error);
    }
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const links = await pool.query('SELECT * FROM links WHERE id = ? ', [id]);
    console.log('view link to edit', links[0]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const { title, url, description } = req.body;
    const updateLink = {
        title, url, description
    }
    await pool.query('UPDATE links SET ? WHERE id = ?',[updateLink, id]);
    req.flash('success', 'Link update successfully');
    res.redirect('/links');
});


module.exports = router;