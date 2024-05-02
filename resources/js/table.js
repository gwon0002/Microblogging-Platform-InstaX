// Function to delete a row when delete button is clicked
function deleteRow(event) 
{
    console.log('Delete button clicked');
    const button = event.target;
    const row = button.parentElement.parentElement;
    const index = button.dataset.index; // Assuming you have a data-index attribute on your delete button

    // Send a request to the server to delete the contact
    fetch('/api/contact', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: index})
    })
    .then(response => {
        if(response.ok || response.status === 404) 
        {
            // Contact deleted successfully or not found on the server, delete from front-end
            row.remove();
        } 
        else 
        {
            // Handle other response codes (optional)
            console.error('Failed to delete contact:', response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Execute when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get all delete buttons and add event listeners
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", deleteRow);
    });

    addTimeUntil();
    console.log("Setting interval for addTimeUntil");
    // Update timers every second
    setInterval(addTimeUntil, 1000);
});