window.addEventListener('load', async (event) => {
    const res = await window.db.getUsers();

    console.log(res);
    res.forEach((value) => {
        
    });
});