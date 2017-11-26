# Deploy plugin
This plugin deploys the release archives (created by `ReleaseArchive` plugin) to a remote server of your choice via `rsync`.
It is a very simple mechanism that copies, unzips, links with nginx, flushes opcache and runs the release callback on each app.

Your server must be accessible via `ssh` and your `nginx` must be configured in advance to point to the appropriate root folder.
See `ServerHelp` plugin for an example of folder structure.