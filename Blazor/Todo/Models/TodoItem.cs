namespace Todo.Models;


public sealed class TodoItemList
{
    public TodoItem[]? Data { get; set; }
}
public sealed class TodoItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Title { get; set; }
    public bool IsComplete { get; set; }
}
