<p align="center">
  <img src="logo.png" alt="Omni Todoist logo" width="128" height="128">
</p>

# Omni Todoist

Omni Todoist is a Chrome extension that lets you add Todoist tasks directly from the browser address bar.

Type `todo` in the Chrome address bar, enter your task, and send it to Todoist.

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file and set your Todoist Client ID:

```env
CLIENT_ID=your_todoist_client_id
```

Build the extension:

```bash
npm run build
```

The built extension will be generated in `dist/`.

## Load the Extension

1. Open `chrome://extensions` in Chrome.
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select the `dist/` directory.

## Usage

Open the extension options page and click `Login` to connect your Todoist account.

After signing in, use the Chrome address bar:

```text
todo Buy milk
```

Press Enter to add `Buy milk` as a Todoist task.

## License

MIT
