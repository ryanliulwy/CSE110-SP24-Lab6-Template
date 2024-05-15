describe('Basic user flow for Website', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:5500/index.html');
    });
  
    it('Check that there are no notes initially', async () => {
        console.log('Checking empty notes...');

        const notes = await page.$$('.note');
        expect(notes.length).toBe(0);
    });

    it('Clicking the "Add Note" button should create a new empty note', async () => {
        console.log('Checking the "Add Note" button...');

        const addNote = await page.$('.add-note');
        await addNote.click();

        const notes = await page.$$('.note');
        expect(notes.length).toBe(1);
    });

    it('Checking that a user can enter text inside the note', async () => {
        console.log('Checking text input for notes...');

        const note = await page.$('.note');
        await note.click();
        await note.type('Initial text for Note 1');

        const notes = await page.$$('.note');
        expect(notes.length).toBe(1);

        const updatedNote = await page.$('.note');
        const text = await (await updatedNote.getProperty('value')).jsonValue();
        expect(text).toBe('Initial text for Note 1');

    });

    it('Checking that a user can create more than one note', async () => {
        console.log('Checking creation of multiple notes...');

        const addNote = await page.$('.add-note');
        await addNote.click();

        const notes = await page.$$('.note');
        const note2 = notes[1];
        await note2.click();
        await note2.type('Initial text for Note 2');

        const updatedNotes = await page.$$('.note');
        const updatedNote1 = updatedNotes[0]
        const updatedNote2 = updatedNotes[1];

        expect(updatedNotes.length).toBe(2);

        const text1 = await (await updatedNote1.getProperty('value')).jsonValue();
        expect(text1).toBe('Initial text for Note 1');

        const text2 = await (await updatedNote2.getProperty('value')).jsonValue();
        expect(text2).toBe('Initial text for Note 2');
    });

    it('Checking that a user can create edit an existing note', async () => {
        console.log('Checking ability to edit existing note...');

        const notes = await page.$$('.note');
        const note1 = notes[0];
        const note2 = notes[1];
        
        await note1.click();
        await page.keyboard.down('ControlLeft');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('ControlLeft');
        await note1.type('Edited text for Note 1');
        await note2.click();

        const updatedNotes = await page.$$('.note');
        const updatedNote1 = updatedNotes[0]
        const updatedNote2 = updatedNotes[1];

        expect(updatedNotes.length).toBe(2);

        const text1 = await (await updatedNote1.getProperty('value')).jsonValue();
        expect(text1).toBe('Edited text for Note 1');

        const text2 = await (await updatedNote2.getProperty('value')).jsonValue();
        expect(text2).toBe('Initial text for Note 2');
    });
    
    it('Checking that created notes persist after reloading', async () => {
        console.log('Checking notes after reload...');

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        const notes = await page.$$('.note');
        const note1 = notes[0]
        const note2 = notes[1];

        expect(notes.length).toBe(2);

        const text1 = await (await note1.getProperty('value')).jsonValue();
        expect(text1).toBe('Edited text for Note 1');

        const text2 = await (await note2.getProperty('value')).jsonValue();
        expect(text2).toBe('Initial text for Note 2');
    });

    it('Checking that a user can delete notes', async () => {
        console.log('Checking note deletion...');

        const notes = await page.$$('.note');
        const note1 = notes[0]
        const note2 = notes[1];

        await note1.click({clickCount: 2});
        await note2.click({clickCount: 2});

        const updatedNotes = await page.$$('.note');

        expect(updatedNotes.length).toBe(0);
    });

    it('Checking that note deletions persist after reloading', async () => {
        console.log('Checking notes after reload...');
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        const notes = await page.$$('.note');

        expect(notes.length).toBe(0);
    });

});