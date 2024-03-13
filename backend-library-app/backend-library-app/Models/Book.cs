namespace backend_library_app.Models
{
    public class Book
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Author { get; set; }
        public string? Created { get; set; }
        public string? Image { get; set; }

    }
}
