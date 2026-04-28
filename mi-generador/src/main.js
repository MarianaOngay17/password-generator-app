import generator from 'generate-password-browser';

const STRENGTH_CLASSES = {
    1: 'bar__too-weak',
    2: 'bar__weak',
    3: 'bar__medium',
    4: 'bar__strong'
};

const STRENGTH_TEXT = {
    1: 'TOO WEAK!',
    2: 'WEAK',
    3: 'MEDIUM',
    4: 'STRONG'
};

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', async function(){

const range = document.getElementById('password-range');
const pass_number = document.querySelector('.password__length-number');
const generate_button = document.querySelector('.password__button');
const btnCopied = document.querySelector('.password__copy');

const newPwdSpan = document.querySelector('#password-text');
const copiedText = document.querySelector('#copied');


newPwdSpan.textContent = "";
copiedText.classList.add('hidden');
pass_number.textContent = range.valueAsNumber;

range.addEventListener('input', function(){
    updateRangeBackground(range)
    pass_number.textContent = this.valueAsNumber;
});

const checks = document.querySelectorAll('.password__check-input');

checks.forEach(check =>{
    check.addEventListener('click', function(){
        updateStrength();
    });

});

generate_button.addEventListener('click', function(){

  const seleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
  const valores = Array.from(seleccionados).map(checkbox => checkbox.value);
  const pass_number = document.querySelector('.password__length-number');

  const newPwdSpan = document.querySelector('#password-text');

  if(valores.length > 0){

    const nuevaPassword = generator.generate({
        length: pass_number.textContent,
        numbers: valores.includes('numbers'),
        symbols: valores.includes('symbols'),
        uppercase: valores.includes('uppercase'),
        lowercase: valores.includes('lowercase'),
        strict: false
      });

    newPwdSpan.textContent = nuevaPassword;

  }

});

btnCopied.addEventListener('click', async function(){

  const newPwdSpan = document.querySelector('#password-text');

  try {
    await navigator.clipboard.writeText(newPwdSpan.textContent);
    copiedText.classList.remove('hidden');

    await esperar(3000);

    copiedText.classList.add('hidden');

  } catch (err) {
    console.error("Error al copiar: ", err);
  }
});


});


function updateStrength(){

    const seleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
    const bars = document.querySelectorAll('.bar-group .bar');
    const bar_text = document.querySelector('.bar__text');

    const valores = Array.from(seleccionados).map(checkbox => checkbox.value);

    var countValores = valores.length;

    const claseActual = STRENGTH_CLASSES[countValores];
    const claseActualTexto = STRENGTH_TEXT[countValores];

    bar_text.textContent = claseActualTexto;

    bars.forEach((bar, index) => {
        bar.classList.remove('bar__too-weak', 'bar__weak', 'bar__medium', 'bar__strong');

        if (index < countValores && claseActual) {
            bar.classList.add(claseActual);
        }
    });

}

function updateRangeBackground(range) {
    const min = range.min;
    const max = range.max;
    const value = range.value;

    const percentage = ((value - min) / (max - min)) * 100;
    const isFirefox = CSS.supports('(-moz-appearance: none)');

    if (!isFirefox) {
        range.style.background = `linear-gradient(
            to right,
            #A4FFAF 0%,
            #A4FFAF ${percentage}%,
            #18171F ${percentage}%,
            #18171F 100%
        )`;
    } else {
        range.style.background = 'transparent';
    }
}
