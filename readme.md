# System Monitor Web Interface

This project is a system monitoring tool that provides a web interface for viewing system information. It is written in Rust and uses the Actix-web framework for the web server.

## Features

- **System Information**: Show detailed system information including CPU usage, memory usage, disk usage, and more.

- **Process Management**: Manage processes directly from the web interface.

- **Web Interface**: A user-friendly web interface to monitor and manage your system activities

## Installation

Ensure you have Rust installed on your system. If not, you can install it from [here](https://www.rust-lang.org/tools/install).

Clone the repository:

```bash

git  clone  https://github.com/iNerdStack/web-system-monitoring.git

cd  system-monitor-web

```

Build the project:

```bash

cargo  build  --release

```

## Usage

Run the executable:

```bash

./target/release/system-monitor-web

```

The web interface will be available at `http://127.0.0.1:3500`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
