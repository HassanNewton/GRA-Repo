import React, { useState } from 'react';

const AddSpellForm = ({ addSpell }) => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [oneUse, setOneUse] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && text !== '') {
            // Skapa ett nytt spell objekt
            const newSpell = { name, text, oneUse };
            // Skicka det nya spell objektet till SpellBook
            addSpell(newSpell);
            // Rensa formuläret efter inlämning
            setName('');
            setText('');
            setOneUse(false);
        } else {
            alert('Vänligen fyll i alla fält');
        }
    };

    return (
        <div className="add-spell-form">
            <h2>Add Spell</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Spell name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>One Use :</label>
                    <input
                        type="checkbox"
                        checked={oneUse}
                        onChange={() => setOneUse(!oneUse)}
                    />
                </div>
                <button type="submit">Add spell</button>
            </form>
        </div>
    );
};

export default AddSpellForm;
