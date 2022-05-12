const { response } = require("express");

module.exports = function(app, passport, db, multer, ObjectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // HOME/FEED SECTION =========================
    app.get('/feed', isLoggedIn, function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
          db.collection('comments').find().toArray((error, rslt) => {
            if (err) return console.log(err)
            res.render('feed.ejs', {
              user : req.user,
              posts: result,
              comment: rslt
            })
          })
        })
    });

    app.get('/map', function (req, res) {
        res.render('map.ejs');
      });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// QP Posts routes ===============================================================
    app.get('/post', isLoggedIn, function(req, res) {
        db.collection('posts').findOne({_id: ObjectId(req.query.id)}, (err, result) => {
            db.collection('comments').find().toArray((error, rslt) => {
                if (err) return console.log(err)
                console.log(result, req.query.id);
                res.render('post.ejs', {
                    user : req.user,
                    post: result,
                    comments: rslt
                })
            })
        })
    });
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'public/img/')
        },
        filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
        }
    })
    var upload = multer({storage: storage})
    app.post('/createPost', upload.single('file-to-upload'), (req, res) => {
      db.collection('posts').save({
        image: "img/" + req.file.filename,
        caption: req.body.caption,
        drug: req.body.drug,
        feedback: req.body.feedback,
        user: req.user._id,
        timestamp: req.body.timestamp
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/feed')
      })
    })
    app.put('/updatePost', (req, res) => {
      db.collection('posts').findOneAndUpdate({
        image: req.body.image,
        caption: req.body.caption,
        drug: req.body.drug,
        feedback: req.body.feedback,
        user: req.user._id,
        },{ $set:{ caption: req.body.newCaption } },{ sort:{_id: -1} }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database');
        res.redirect('/feed');
      })
    })

    app.delete('/delPost', (req, res) => { console.log(req.body)
      db.collection('posts').findOneAndDelete({
        _id: ObjectId(req.body.id)
        }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    //USER'S POSTS
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
            for(post in result) {
                if(post.id != ObjectId(req.user.id))
                    delete result.post
            }
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            posts: result
          })
        })
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('posts').findOne({_id: ObjectId(req.query.id)}, (err, result) => {
            db.collection('comments').find().toArray((error, rslt) => {
                if (err) return console.log(err)
                console.log(result, req.query.id);
                res.render('profile.ejs', {
                    user : req.user,
                    post: result,
                    comments: rslt
                })
            })
        })
    });
    // COMMENTS SECTION

    app.get('/comment', isLoggedIn, function(req, res) {
        db.collection('comments').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('post.ejs', {
            user : req.user,
            comments: result
        })
        })
    });

    app.post('/createComment', (req, res) => {
        const comingFromPage = req.headers['referer'].slice(req.headers['origin'].length);
        db.collection('comments').insertOne({
            comment: req.body.comment, 
            poster: req.user._id, 
            post: req.body.postId,
            timestamp: req.body.timestamp
        }, (err, result) => {
            if (err) return res.send(err);
            console.log('Comment Created');
            res.redirect(comingFromPage);
        })
    })
    app.delete('/delComment', (req, res) => {
        db.collection('comments').findOneAndDelete({
          comment: req.body.comment,
          poster: req.user._id,
          post: req.body.postId
          }, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })

    //Bookmark Page

    app.get('/bookmark', isLoggedIn, function(req, res) { 
            db.collection('posts').find({}).toArray((err,result)=>{
              let filteredPost = result.filter(post => req.user.bookmarks.includes(post._id.toString()))
              res.render('bookmark.ejs', {
                user : req.user,
                bookmark: filteredPost,
            })
        })
    });

    app.put('/bookmark', isLoggedIn, function(req, res) {
      db.collection('users').findOneAndUpdate({_id: req.user._id}, {
        $push : {
          bookmarks: req.body.postId
        },
      }, {},
      (err, result)=>{
        res.send();
      })
    })

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'public/img/')
        },
        filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
        }
    })
    var upload = multer({storage: storage})
    app.post('/createPost', upload.single('file-to-upload'), (req, res) => {
      db.collection('posts').save({
        image: "img/" + req.file.filename,
        caption: req.body.caption,
        drug: req.body.drug,
        feedback: req.body.feedback,
        user: req.user._id,
        timestamp: req.body.timestamp
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/feed')
      })
    })
    app.put('/updatePost', (req, res) => {
      db.collection('posts').findOneAndUpdate({
        image: req.body.image,
        caption: req.body.caption,
        drug: req.body.drug,
        feedback: req.body.feedback,
        user: req.user._id,
        },{ $set:{ caption: req.body.newCaption } },{ sort:{_id: -1} }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database');
        res.redirect('/feed');
      })
    })


    app.put('/updateSaved', (req, res) => { console.log(req.user)
      // db.collection('posts').findOneAndDelete({
      //   _id: ObjectId(req.body.id)
      //   }, (err, result) => {
      //   if (err) return res.send(500, err)
      //   res.send('Message deleted!')
      // })
      if(req.user.bookmarks.includes(req.body.id))
        req.user.bookmarks.splice(req.user.bookmarks.indexOf(req.body.id),1)
      db.collection('users').findOneAndUpdate({_id:req.user._id},{$set:{bookmarks:req.user.bookmarks}},{},(err,result)=>{if (err) return console.log(err)
        console.log('saved to database');
        res.send();
      })
    })

      
    //Search Page

    app.get('/search',isLoggedIn, function(req, res){ 
      db.collection('posts').find({}).toArray((err,result)=>{ 
        if (err) return console.log(err)
        const arr= []
        result.forEach((p,i)=>{
          if (req.query.drug===p.drug){
            arr.push(p)
          }
        });console.log(arr)
        res.render('searchResult.ejs',{
          result:arr
        })
      })
    })


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/feed', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/feed', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/feed');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
