# figma-export

figma-export is a CLI tool for bulk exporting Figma and FigJam files to your local desktop in Figma's proprietary `.fig`/`.jam` format.

This tool leverages [Figma's REST API](https://www.figma.com/developers/api) and [Playwright](https://playwright.dev/) to automate discovering Figma files and downloading them.

## Table of contents

- [Requirements](#requirements)
- [Installation](#Installation)
- [Usage](#usage)
- [Commands](#commands)
- [Known issues](#known-issues)

## Requirements

- node (v18.x.x)
- npm (v9.x.x)

Other versions may work, but have not been officially tested.

You will also need a [Figma access token](https://www.figma.com/developers/api#authentication) that you can generate through your Figma user profile settings.

## Installation

1. Clone the repository or download the latest release
2. `cd` into the repository
3. Run `npm install`

## Usage

### Environment variables

Create a `.env` file at the root of the repository:

```sh
FIGMA_EMAIL=email@example.com
FIGMA_PASSWORD=hunter2
FIGMA_ACCESS_TOKEN=figd_abcdefghijklmnopqrstuvwxyz
DOWNLOAD_PATH="/Users/anonymous/Downloads/" # Absolute path where files will be downloaded to
WAIT_TIMEOUT=10000 # Time in ms to wait between downloads
```

### Generating files.json

`files.json` determines which Figma files within your account will be downloaded.

It is recommended that you use one of the built-in commands to generate `files.json`:

- `npm run get-team-files {team_id}` - Gets all files for all projects within a given team ID
    - Example: `npm run get-team-files 1234567890`
- `npm run get-project-files {project_ids ...}` - Gets all files for given project IDs (space separated)
    - Example: `npm run get-project-files 12345 67890`

To find your Figma team ID, navigate to your [Figma home](https://www.figma.com/files/), right click your team in the left sidebar, and then click **Copy link**. The last segment of the URL that you copied will contain your team ID: `https://www.figma.com/files/team/1234567890`.

To find a project ID, navigate to your team's home, right click the project, and then click **Copy link**. The last segment of the URL that you copied will contain the project ID: `https://www.figma.com/files/project/1234567890`.

You are free to manually construct this file as long as it follows this structure:

```json
[
  {
    "name": String,
    "id": String,
    "files": [
      {
        "key": String,
        "name": String
      },
      ...
    ]
  },
  ...
]
```

This is a modified structure from the return value of [Figma's GET project files](https://www.figma.com/developers/api#get-project-files-endpoint) endpoint.

### Starting the downloads

Once you have generated `files.json`, you can then run `npm run start` to start the downloads. The status of each download will be shown in the console.

Each file will be downloaded to your specified `DOWNLOAD_PATH` in a folder named with the project's name and ID. Each file will be saved as the file's name and ID (key).

### Parallel downloads

Parallel downloads are disabled by default. To enable them, update the following properties in `playwright.config.ts`:

```ts
export default defineConfig({
  ...
  fullyParallel: true,
  workers: 3, // The maximum number of parallel downloads
  ...
});
```

### Retrying failed downloads

If you encounter downloads that fail, you can attempt to re-run _only_ those failed downloads using the `npm run retry` command.

Note that downloads may fail due to any number of reasons, but typically it is due to reaching the Playwright timeout. You can increase this timeout by updating the `timeout` configuration in `playwright.config.ts`.

## Commands

The following commands are available via `npm run`:

| Command | Description |
| === | === |
| `get-team-files` | Generates `files.json` from a Figma team ID |
| `get-project-files` | Generates `files.json` from Figma project ID(s) |
| `start` | Starts downloads |
| `retry` | Retries failed downloads from last run |
| `dry-run` | Lists downloads |

## Known issues

- SSO authentication is not supported (suggest using email and password)
- Two-factor authentication is not supported (suggest temporarily disabling two-factor authentication)
- Some downloads may take a long time (large file size, slow internet connection, etc.) which can trigger the Playwright timeout and lead to a failed download (suggest increasing the `timeout` in `playwright.config.ts`)
- Rate limiting may occur as it is not clear if Figma will throttle based off of how many files you download (suggest using `WAIT_TIMEOUT`)
