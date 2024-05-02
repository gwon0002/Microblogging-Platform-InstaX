document.addEventListener('DOMContentLoaded', function() 
{
    // Function to toggle between light and dark mode
    function toggle_style() 
    {
        // Toggle the 'dark-mode' class on the body element
        document.body.classList.toggle('dark-mode');

        // Store the theme preference in local storage
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }
    // Function to handle the 'Delete' action
    const handleDelete = async (index) => {
        try 
        {
        const response = await fetch('/deleteContact', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({index}),
        });
        const data = await response.json();
    
        if(data.success) 
        {
            // Remove the deleted post from the UI
            const postContainer = document.querySelector(`.posteach:nth-child(${index + 1})`);
            if(postContainer) 
            {
            postContainer.remove();
            }
        } 
        else 
        {
            console.error('Error deleting post:', data.error);
        }
        } 
        catch(error) 
        {
        console.error('Error deleting post:', error);
        }
    };
    // Attach click event listener to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function (button) 
    {
        button.addEventListener('click', function () 
        {
        const index = parseInt(this.dataset.index); // Get the index of the post
        handleDelete(index); // Handle the 'Delete' action
        });
    });
    
    // Function to handle editing a post
    function handleEditPost(index, newContent) 
    {
        const postContent = document.querySelector(`.posteach:nth-child(${index + 1}) .post-content p`);
        if(postContent) 
        {
            // Create a textarea for editing the content
            const textarea = document.createElement('textarea');
            textarea.value = newContent;
            textarea.rows = 5;
            textarea.cols = 50;
            textarea.classList.add('edit-textarea');

            // Create an "Update" button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('update-button');

            // Replace the existing content with the textarea and update button
            postContent.innerHTML = '';
            postContent.appendChild(textarea);
            postContent.appendChild(updateButton);

            // Add an event listener to the "Update" button
            updateButton.addEventListener('click', function() {
                const updatedContent = textarea.value;
                if(updatedContent !== null && updatedContent !== '') 
                {
                    contacts[index].content = updatedContent;
                    postContent.innerHTML = `<p>${updatedContent}</p>`;
                }
            });
        }
    }
    // Handle the 'Like' action
    const handleLike = async (index) => {
        try 
        {
            // Send a request to increment the like count for a specific post
            const response = await fetch('/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index }),
            });
            const data = await response.json();

            if(data.likes !== undefined) 
            {
                // Update the like count display for the specific post
                const likeCount = document.getElementById(`like-count-${index}`);
                if(likeCount) 
                {
                    likeCount.textContent = data.likes;
                }
            }
        } 
        catch(error) 
        {
            console.error('Error updating like count:', error);
        }
    };
    // Get the theme toggle element
    const themeToggle = document.getElementById('theme-toggle');

    // Attach a click event listener to the theme toggle button
    themeToggle.addEventListener('click', function() 
    {
        // Call the toggle_style function when the button is clicked
        toggle_style();
    });

    // Check local storage for theme preference and apply it
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') 
    {
        // If dark mode is saved in local storage, apply it
        toggle_style();
    }

    // Attach click event listener to edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(function(button) 
    {
        button.addEventListener('click', function() 
        {
            let contacts = [];
            const index = parseInt(this.dataset.index); // Get the index of the post
            const currentContent = contacts[index].content; // Get the current content of the post
            handleEditPost(index, currentContent); // Handle the editing of the post
        });
    });
    // Attach click event listener to like buttons
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(function(button) 
    {
        button.addEventListener('click', function() 
        {
            const index = parseInt(this.dataset.index); // Get the index of the post
            handleLike(index); // Handle the 'Like' action
            button.disabled = true; // Disable the button after click to prevent multiple clicks
        });
    });
});
// Handle click on edit button
document.addEventListener('click', async (event) => {
    if(event.target.classList.contains('edit-button')) 
    {
        const index = event.target.getAttribute('data-index');
        try 
        {
            // Fetch the original post content
            const response = await fetch(`/getContact?index=${index}`);
            const data = await response.json();
    
            // Populate the text area with the original content
            // Assume textAreaId is the ID of your text area in the HTML
            document.getElementById('textAreaId').value = data.content;
        } 
        catch(error) 
        {
            console.error('Error fetching post details:', error);
        }
    }
    if(event.target.classList.contains('complete-button')) 
    {
        const index = event.target.getAttribute('data-index');
        const newContent = document.getElementById('textAreaId').value;
        try 
        {
            // Send a request to update the post content
            const response = await fetch('/updateContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index, newContent }),
            });
            const data = await response.json();
            if(data.success) 
            {
                const postContent = document.querySelector(`.posteach:nth-child(${index + 1}) .post-content p`);
                postContent.innerHTML = `<p>${newContent}</p>`;
            } 
            else 
            {
                console.error('Error updating post content:', data.error);
            }
        } 
        catch(error) 
        {
                console.error('Error updating post content:', error);
        }
    }
});
