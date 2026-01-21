# ReadIt

A lightweight, modern system that extends Reddit’s functionality with plugin support.

## What is this?

This is an experimental rewrite of the original project, designed to be faster, cleaner, and far more flexible. It focuses on modern architecture and extensibility while keeping overhead to a minimum.

### What’s different?

The original ReadIt relied heavily on raw DOM patching, which led to fragility and hard-to-maintain code. It also depended on external UI libraries, increasing bundle size and overall complexity.

This rewrite introduces a brand-new modules system. Instead of shipping its own UI framework, ReadIt patches Reddit’s module loader to access Lit directly from the source. This results in:

- Significantly less bloat

- A cleaner, more maintainable architecture

- New and powerful plugin possibilities enabled by the modules system

Overall, this version is lighter, more robust, and opens the door to features that weren’t practical in the original implementation.
