import './style.css';

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      amount: document.getElementById('amount').value.trim(),
      timestamp: new Date().toISOString()
    };

    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    console.log('📤 Отправка данных на:', scriptUrl);
    console.log('📦 Данные:', formData);

    if (!scriptUrl) {
      alert('Ошибка конфигурации: отсутствует URL Google Script');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('✅ Ответ сервера:', result);

      if (result.success) {
        alert('✅ Заявка успешно отправлена!');
        contactForm.reset();
      } else {
        alert('⚠️ Ошибка при отправке: ' + (result.error || 'Неизвестная ошибка'));
      }

    } catch (error) {
      console.error('❌ Ошибка при отправке формы:', error);
      alert('Произошла ошибка. Проверьте подключение или настройки.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
