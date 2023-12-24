mod system;

use actix_files as fs;
use actix_web::{App, HttpServer};
use std::path::Path;
use system::{get_system_info, kill_process};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    //Verify that the 'web' directory exists at boot:
    if Path::new("./web").exists() {
        println!("\x1b[32mWeb Directory: ✔\x1b[0m");
    } else {
        // exist if directory is not found:
        println!("\x1b[31mWeb Directory: ✘\x1b[0m");
        println!("\x1b[31mWarning: \x1b[0m'web' directory is \x1b[31mmissing\x1b[0m. Please ensure the folder is present in the same directory as the executable.");
        println!("Press Ctrl+C to stop");
        // std::process::exit(1);
    }

    println!("Starting web monitoring UI at \x1b[32mhttp://127.0.0.1:3500\x1b[0m");

    HttpServer::new(|| {
        App::new()
            .service(get_system_info)
            .service(kill_process)
            .service(fs::Files::new("/", "./web").index_file("index.html"))
    })
    .bind("127.0.0.1:3500")?
    .run()
    .await
}
