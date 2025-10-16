// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ GOOGLE APPS SCRIPT
//
// 1. Откройте Google Sheets и создайте новую таблицу
// 2. Назовите первый лист "Заявки" или любым другим именем
// 3. В первой строке добавьте заголовки:
//    A1: Дата и время
//    B1: Имя
//    C1: Email
//    D1: Телефон
//    E1: Сумма инвестиций
//
// 4. Нажмите "Расширения" → "Apps Script"
// 5. Удалите весь код и вставьте код ниже
// 6. Нажмите "Развернуть" → "Новое развертывание"
// 7. Выберите тип: "Веб-приложение"
// 8. Настройки:
//    - Описание: AXI Contact Form
//    - Выполнить от имени: Меня
//    - У кого есть доступ: Все
// 9. Нажмите "Развернуть"
// 10. Скопируйте URL веб-приложения
// 11. Вставьте URL в файл .env: VITE_GOOGLE_SCRIPT_URL=ваш_url

// КОД ДЛЯ GOOGLE APPS SCRIPT (СКОПИРУЙТЕ НИЖЕ):

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Заявки');

    if (!sheet) {
      throw new Error('Sheet not found');
    }

    const data = JSON.parse(e.postData.contents);

    const timestamp = new Date(data.timestamp);
    const formattedDate = Utilities.formatDate(timestamp, 'GMT+3', 'dd.MM.yyyy HH:mm:ss');

    sheet.appendRow([
      formattedDate,
      data.name,
      data.email,
      data.phone,
      data.amount
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Service is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
