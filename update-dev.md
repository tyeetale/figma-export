---
Title: Update Dev Environment Steps
Date: October 11 2024
Author: Thomas Yee (tyee)
---

# Update Dev Environments

## Purpose

This is to quickly update the macbook to spec.

## OS

Check via the system settings. Ideally, we only want to install the 2nd latest OS, or the most stable.

## Terminal

## XCode

> `xcode-select --install`

## VSCode

## Homebrew

> `brew update`

### Nvm

[useful commands](https://gist.github.com/chranderson/b0a02781c232f170db634b40c97ff455)

#### Node

#### NPM, Yarn, etc.

### Python

## Macports

> https://www.macports.org/install.php > https://trac.macports.org/wiki/Migration

- Install the newest verion of the macports you have for the system.
- After installing, run `sudo port migrate` to update everything.s

## Research

- [asdf managed runtime & package manager for node](https://asdf-vm.com/)

Listing people's recommendations with links below. I'm glad I asked this question. I received a lot of great feedback. Thanks All!

- nvm (https://nvm.sh) - Simple to use and easy to follow instructions with more in-depth configuration for those that need it. Some experienced a slightly slower terminal. Supports nodjs, iojs, and node version per project/directory.
- fnm (https://github.com/Schniz/fnm) - Built with speed in mind. It is like nvm, but faster. Also supports node version per project/directory.
- Volta (https://volta.sh/) - Looks easy to use and has good documentation.
- asdf (https://asdf-vm.com/) - Supports multiple runtimes and tools by adding plugins. Admittedly, is a bit confusing and more than I need right now (Node, Rust, Python, Ruby, etc.)
- Homebrew (https://brew.sh/) - Not a version manager but can act like one by installing nvm, fnm, asdf, or others. Some additional configuration may be needed.
- Proto (https://moonrepo.dev/proto) - Supports Bun, Deno, Node.js (npm, pnpm, yarn), Rust, and Go. Also good documentation. Setup looks a bit complex to me :/.
- n (https://github.com/tj/n) - Supports Node and npm per project. Simple and to the point.

- Clean up VSCode Config
