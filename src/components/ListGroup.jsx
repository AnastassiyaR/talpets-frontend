import { useState } from "react";

function ListGroup() {
    const [selectedIndex, setSelectedIndex] = useState(-1); // At first element not chosen
    const items = ['Task 1', 'Task 2', 'Task 3']; // List

    const handleSelectItem = (item) => {
        console.log(item);
    };

    return (
        <>
            <h1>Tasks</h1>
            {items.length === 0 && <p> No items :( </p>}
            <ul className="list-group">
                {items.map((item, index) => (
                    <li
                        className={
                            selectedIndex === index
                                ? 'list-group-item active' // If element is selected
                                : 'list-group-item' // Normal style
                        }
                        key={item} // Make sure that 'item' is unique
                        onClick={() => {
                            setSelectedIndex(index); // Update the index of the selected item
                            handleSelectItem(item); // Call the function with the selected item
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ListGroup;
