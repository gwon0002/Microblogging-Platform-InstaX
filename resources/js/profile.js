document.addEventListener('DOMContentLoaded', function() 
{
    const contentTextarea = document.getElementById('content');
    const confirmationMessage = document.getElementById('confirmation-message');

    // Function to update character count
    function updateCharacterCount() 
    {
        const characterCount = contentTextarea.value.length;
        confirmationMessage.textContent = `Character Count: ${characterCount}/50`;
    }

    // Attach event listener to the content textarea
    contentTextarea.addEventListener('input', updateCharacterCount);
});
