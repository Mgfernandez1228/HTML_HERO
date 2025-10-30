document.addEventListener('DOMContentLoaded', function () {
    const broken = document.getElementById('broken-code-1');
    if (broken) {
        broken.innerText = '<p>This is a header</p>\n<h1>This is a paragraph</h1>';
    }

    const line1 = document.getElementById('line-1');
    const line2 = document.getElementById('line-2');
    const output = document.getElementById('output-1');
    const submitBtn = document.getElementById('next');

    const correctCode1 = ['<h1>This is a header</h1>', '<p>This is a paragraph</p>'];

    function checkSubmission() {
        const userCode1 = [line1 ? line1.value : '', line2 ? line2.value : ''];
        if (!output) 
            return;
        if (correctCode1[0] === userCode1[0] && correctCode1[1] === userCode1[1]) {
            output.innerText = 'Code has been fixed!';
        } else if (userCode1[0] !== '' && userCode1[1] !== '') {
            output.innerText = 'Nope, code is still broken.';
            if (submitBtn) submitBtn.style.display = 'none';
        } else {
            output.innerText = '';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    [line1, line2].forEach(el => {
        if (!el) 
            return;
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkSubmission();
            }
        });
    });
});
