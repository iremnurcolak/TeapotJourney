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

### Project 2 — Transformations

Open [project2.html](project2/project2.html) in a browser to run the UAV simulation. The two functions in [project2.js](project2/project2.js) build and combine its 2D transformations.

- **`GetTransform(positionX, positionY, rotation, scale)`** converts the angle from degrees to radians and builds separate scaling, rotation, and translation matrices. It returns `T × R × S`, which scales a point first, rotates it second, and translates it last. For example, scaling `(1, 0)` by 2, rotating it by 90°, and translating it by `(10, 20)` gives `(10, 22)`.
- **`ApplyTransform(trans1, trans2)`** returns `trans2 × trans1`, so a point goes through `trans1` first and `trans2` second. It computes each entry by taking the dot product of a row from `trans2` and a column from `trans1`. The simulation uses this to apply each propeller's local rotation and offset before applying the UAV body's transform.

Both functions return a 3×3 matrix as a nine-element array in column-major order. The translation values are at indices 6 and 7, in the last column of the matrix.

### Project 3 — Curves

Open [project3.html](project3/project3.html) in a browser and drag any of the four control points to reshape the cubic Bézier curve. The [`CurveDrawer` class](project3/project3.js) draws the red curve with WebGL.

- The constructor uploads 500 evenly spaced parameter values from `t = 0` to `t = 1` to a vertex buffer. Each vertex reads one `t` value.
- `updatePoints()` sends the four control points to the vertex shader as uniforms. For each `t`, the shader uses De Casteljau's algorithm, interpolating between neighboring points in three rounds until a single point on the curve remains.
- `setViewport()` builds the matrix that maps pixel coordinates to WebGL coordinates. It flips the Y axis so the curve aligns with the on-screen control points.
- `draw()` connects the sampled points in order with `gl.LINE_STRIP`. Dragging a control point updates the uniforms and redraws the curve using the same parameter buffer.

📖 Reference

Based on Cem Yuksel's "Introduction to Computer Graphics" CS4600 course.
