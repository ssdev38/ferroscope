pub struct __Memory{
    total:String,
    free:String
}
impl __Memory {
    pub fn new(total:u64,free:u64)->Self{
    
        let total_memory_bytes=total  as f64 / (1024.0 * 1024.0 * 1024.0);
        let free_memory_bytes=free  as f64 / (1024.0 * 1024.0 * 1024.0);
        __Memory{
        total:format!("{:.2} GiB",total_memory_bytes),
        free:format!("{:.2} GiB",free_memory_bytes)}
    }
}