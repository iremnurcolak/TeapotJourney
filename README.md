Teapot Journey

This repository contains my implementations of the projects from Cem Yuksel's Introduction to Computer Graphics CS4600 course at the University of Utah.

🎯 Purpose

A simple place to track my progress and store the projects I complete while following the course.

📂 Repository Structure

`project1/`, `project2/`, and the other numbered folders contain the code and assets for each course project.

🚀 Projects

### Project 1 — Compositing Images

Open [project1.html](project1/project1.html) in a browser. Add images with **+**, drag an image on the canvas to position it, and use the layer controls to adjust opacity or remove an image. Sample images are in `project1/`.

The bottom image defines the canvas size. The app composites the remaining layers from bottom to top. The [`composite` function](project1/project1.js) blends the overlapping pixels in place and skips pixels outside the canvas, including when a layer has a negative offset.

The effective foreground alpha is the pixel's alpha multiplied by the layer opacity. The output alpha is `foregroundAlpha + backgroundAlpha * (1 - foregroundAlpha)`. Each RGB channel is blended with those same foreground and background contributions, then divided by the output alpha because `ImageData` stores straight RGB values. For example, a 50% opaque red pixel over a fully transparent background produces `[255, 0, 0, 128]` in RGBA order.

Removing the last layer clears the canvas, so the previous image disappears as soon as the layer list is empty.

📖 Reference

Based on Cem Yuksel's "Introduction to Computer Graphics" CS4600 course.
