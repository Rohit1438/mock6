










const { Router } = require("express");
const blogs = require("../models/blogModel");
const blogRouter = Router();
const auth = require("../middleware/authMiddleware");

// Get all blogs
// Get all blogs
blogRouter.get("/blogs",async (req, res) => {
    try {
        const blogData = await blogs.find().populate("creator");
        res.status(200).json({ msg: "All blogs", blogData });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

  blogRouter.post("/blogs/add",  async (req, res) => {
    try {
        const { title, content, category, date } = req.body;

        const newBlog = await blogs.create({
            ...req.body,
            creator: req.userId, 
            title,
            content,
            category,
            date,
        });

   
        await newBlog.populate("creator")

        res.status(200).json({ message: "Blog added successfully", blog: newBlog });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

blogRouter.get("/blogs/:id", auth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogs.findById(blogId).populate("creator"); // Populate user data
        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: "Blog not found" });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

blogRouter.put("/blogs/:id", auth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const updatedBlog = await blogs.findByIdAndUpdate(blogId, req.body, {
            new: true,
        });
        if (updatedBlog) {
            res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
        } else {
            res.status(404).json({ message: "Blog not found" });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});


blogRouter.delete("/blogs/:id", auth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await blogs.findByIdAndRemove(blogId);
        if (deletedBlog) {
            res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
        } else {
            res.status(404).json({ message: "Blog not found" });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = blogRouter;

















