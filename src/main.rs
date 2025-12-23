mod system;
use system::logic::memory_usage;
// -> Result<(), Box<dyn std::error::Error>> 
fn main() {
    memory_usage().unwrap();
}
