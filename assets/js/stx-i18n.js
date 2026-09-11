/**
 * stx-i18n.js — Scooter's Toolbox UI language (chrome + common labels).
 * Persists in localStorage (stx_ui_lang). Game part names stay English (data).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'stx_ui_lang';
  var LANGS = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'ru', label: 'Русский' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' }
  ];

  /* English source — other locales override keys they translate. */
  var EN = {
    'lang.label': 'Language',
    'brand.title': "Scooter's Toolbox",
    'anim.full': 'Full anim',
    'anim.none': 'No anim',
    'anim.fullTitle': 'Enable slow colour sweeps on buttons',
    'anim.noneTitle': 'Stop all animations and motion completely',
    'theme.reset': 'Reset theme',
    'cta.importLong': 'Have a code to import/edit? Click here',
    'cta.importShort': 'Import / edit code',
    'cta.savLong': 'Using a .Sav/.yaml? Click here',
    'cta.savShort': 'Open Save / YAML',
    'nav.discord': 'Scooters Garage',
    'nav.issues': '💭 Issues',
    'nav.stats': '📊 Stats',
    'nav.instructions': '📄 Instructions',
    'nav.support': '🫶 Support / Donate',
    'stats.title': 'Live stats',
    'stats.sub': 'Global totals (PHP API — same layout as Netlify)',
    'stats.views': 'Page views',
    'stats.unique': 'Unique visitors',
    'stats.itemsWorld': 'Items crafted (world)',
    'stats.yourVisits': 'Your visits (this browser)',
    'stats.unavailable': 'Stats unavailable.',
    'stats.browser': 'Your browser',
    'stats.itemsLocal': 'Items crafted (local)',
    'instr.expanded': 'Expanded',
    'instr.simple': 'Simple',
    'instr.loading': 'Loading instructions…',
    'banner.vc4': 'Updated for Vault Card 5 and Loveless',
    'section.simple': 'Simple Builder',
    'section.guided': 'Guided Builder',
    'section.yaml': 'Save / YAML',
    'section.tools': 'Tools & Parts',
    'btn.copy': 'Copy',
    'btn.clear': 'Clear',
    'btn.import': 'Import',
    'btn.delete': 'Delete',
    'btn.apply': 'Apply',
    'btn.save': 'Save',
    'btn.refresh': 'Refresh',
    'btn.start': 'Start',
    'label.itemType': 'Item Type',
    'label.manufacturer': 'Manufacturer',
    'label.weaponType': 'Weapon Type',
    'label.itemLevel': 'Item level',
    'label.rarity': 'Rarity (select rarity tier)',
    'label.seed': 'Seed (optional)',
    'label.skin': 'Skin (optional)',
    'label.camo': 'Camo (optional)',
    'label.charName': 'Character Name:',
    'label.difficulty': 'Difficulty:',
    'label.charLevel': 'Character Level:',
    'label.xp': 'Experience Points:',
    'diff.easy': 'Set Easy',
    'diff.normal': 'Set Normal',
    'diff.hard': 'Set Hard',
    'yaml.statsHeading': 'Character Stats Editor (Lines 5-13):',
    'yaml.pasteHint': 'Paste YAML, load a file with the buttons above, or drag & drop a .yaml / .yml / .sav here (character or profile).',
    'gen.code': 'Generated Item Code',
    'gen.serial': 'Serial (BL-base85)',
    'gen.deser': 'Generated Code (Deserialized)',
    'history.title': 'Items Made (History)',
    'history.download': 'Download .txt',
    'history.close': 'Close',
    'picker.hint': 'UI language (saved on this device)'
  };

  function clone(base) {
    var o = {};
    for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) o[k] = base[k];
    return o;
  }

  function pack(overrides) {
    var o = clone(EN);
    for (var k in overrides) if (Object.prototype.hasOwnProperty.call(overrides, k)) o[k] = overrides[k];
    return o;
  }

  var DICTS = {
    en: EN,
    es: pack({
      'lang.label': 'Idioma',
      'anim.full': 'Anim. completa',
      'anim.none': 'Sin anim.',
      'theme.reset': 'Restablecer tema',
      'cta.importLong': '¿Tienes un código para importar/editar? Pulsa aquí',
      'cta.importShort': 'Importar / editar código',
      'cta.savLong': '¿Usas .Sav/.yaml? Pulsa aquí',
      'cta.savShort': 'Abrir Save / YAML',
      'nav.discord': 'Scooters Garage',
      'nav.issues': '💭 Problemas',
      'nav.stats': '📊 Estadísticas',
      'nav.instructions': '📄 Instrucciones',
      'nav.support': '🫶 Apoyar / Donar',
      'stats.title': 'Estadísticas en vivo',
      'stats.sub': 'Totales globales (API PHP)',
      'stats.views': 'Vistas de página',
      'stats.unique': 'Visitantes únicos',
      'stats.itemsWorld': 'Ítems creados (mundo)',
      'stats.yourVisits': 'Tus visitas (este navegador)',
      'stats.unavailable': 'Estadísticas no disponibles.',
      'stats.browser': 'Tu navegador',
      'stats.itemsLocal': 'Ítems creados (local)',
      'instr.expanded': 'Completo',
      'instr.simple': 'Simple',
      'instr.loading': 'Cargando instrucciones…',
      'banner.vc4': 'Actualizado para Loveless',
      'section.simple': 'Constructor Simple',
      'section.guided': 'Constructor Guiado',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Herramientas y piezas',
      'btn.copy': 'Copiar',
      'btn.clear': 'Borrar',
      'btn.import': 'Importar',
      'btn.delete': 'Eliminar',
      'btn.apply': 'Aplicar',
      'btn.save': 'Guardar',
      'btn.refresh': 'Actualizar',
      'btn.start': 'Inicio',
      'label.itemType': 'Tipo de ítem',
      'label.manufacturer': 'Fabricante',
      'label.weaponType': 'Tipo de arma',
      'label.itemLevel': 'Nivel del ítem',
      'label.rarity': 'Rareza (elige el nivel)',
      'label.seed': 'Semilla (opcional)',
      'label.skin': 'Skin (opcional)',
      'label.camo': 'Camuflaje (opcional)',
      'label.charName': 'Nombre del personaje:',
      'label.difficulty': 'Dificultad:',
      'label.charLevel': 'Nivel del personaje:',
      'label.xp': 'Puntos de experiencia:',
      'diff.easy': 'Fácil',
      'diff.normal': 'Normal',
      'diff.hard': 'Difícil',
      'yaml.statsHeading': 'Editor de stats del personaje:',
      'yaml.pasteHint': 'Pega YAML, carga un archivo o arrastra aquí un .yaml / .yml / .sav (personaje o perfil).',
      'gen.code': 'Código del ítem generado',
      'gen.serial': 'Serial (BL-base85)',
      'gen.deser': 'Código deserializado',
      'history.title': 'Ítems creados (historial)',
      'history.download': 'Descargar .txt',
      'history.close': 'Cerrar',
      'picker.hint': 'Idioma de la interfaz (se guarda en este dispositivo)'
    }),
    fr: pack({
      'lang.label': 'Langue',
      'anim.full': 'Anim. complète',
      'anim.none': 'Sans anim.',
      'theme.reset': 'Réinitialiser le thème',
      'cta.importLong': 'Un code à importer/éditer ? Cliquez ici',
      'cta.importShort': 'Importer / éditer le code',
      'cta.savLong': 'Fichier .Sav/.yaml ? Cliquez ici',
      'cta.savShort': 'Ouvrir Save / YAML',
      'nav.issues': '💭 Problèmes',
      'nav.stats': '📊 Stats',
      'nav.instructions': '📄 Instructions',
      'nav.support': '🫶 Soutenir / Donner',
      'stats.title': 'Stats en direct',
      'stats.sub': 'Totaux globaux (API PHP)',
      'stats.views': 'Vues de page',
      'stats.unique': 'Visiteurs uniques',
      'stats.itemsWorld': 'Objets créés (monde)',
      'stats.yourVisits': 'Vos visites (ce navigateur)',
      'stats.unavailable': 'Stats indisponibles.',
      'stats.browser': 'Votre navigateur',
      'stats.itemsLocal': 'Objets créés (local)',
      'instr.expanded': 'Complet',
      'instr.simple': 'Simple',
      'instr.loading': 'Chargement des instructions…',
      'banner.vc4': 'Mis à jour pour Loveless',
      'section.simple': 'Constructeur Simple',
      'section.guided': 'Constructeur Guidé',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Outils & pièces',
      'btn.copy': 'Copier',
      'btn.clear': 'Effacer',
      'btn.import': 'Importer',
      'btn.delete': 'Supprimer',
      'btn.apply': 'Appliquer',
      'btn.save': 'Enregistrer',
      'btn.refresh': 'Actualiser',
      'btn.start': 'Démarrer',
      'label.itemType': "Type d'objet",
      'label.manufacturer': 'Fabricant',
      'label.weaponType': "Type d'arme",
      'label.itemLevel': "Niveau de l'objet",
      'label.rarity': 'Rareté (choisir le palier)',
      'label.seed': 'Graine (optionnel)',
      'label.skin': 'Skin (optionnel)',
      'label.camo': 'Camouflage (optionnel)',
      'label.charName': 'Nom du personnage :',
      'label.difficulty': 'Difficulté :',
      'label.charLevel': 'Niveau du personnage :',
      'label.xp': "Points d'expérience :",
      'diff.easy': 'Facile',
      'diff.normal': 'Normal',
      'diff.hard': 'Difficile',
      'yaml.statsHeading': 'Éditeur de stats du personnage :',
      'yaml.pasteHint': 'Collez du YAML, chargez un fichier ou déposez un .yaml / .yml / .sav ici.',
      'gen.code': "Code d'objet généré",
      'gen.serial': 'Sérial (BL-base85)',
      'gen.deser': 'Code désérialisé',
      'history.title': 'Objets créés (historique)',
      'history.download': 'Télécharger .txt',
      'history.close': 'Fermer',
      'picker.hint': "Langue de l'interface (enregistrée sur cet appareil)"
    }),
    de: pack({
      'lang.label': 'Sprache',
      'anim.full': 'Volle Anim.',
      'anim.none': 'Keine Anim.',
      'theme.reset': 'Theme zurücksetzen',
      'cta.importLong': 'Code importieren/bearbeiten? Hier klicken',
      'cta.importShort': 'Code importieren / bearbeiten',
      'cta.savLong': '.Sav/.yaml verwenden? Hier klicken',
      'cta.savShort': 'Save / YAML öffnen',
      'nav.issues': '💭 Probleme',
      'nav.stats': '📊 Statistik',
      'nav.instructions': '📄 Anleitung',
      'nav.support': '🫶 Unterstützen / Spenden',
      'stats.title': 'Live-Statistik',
      'stats.sub': 'Globale Summen (PHP-API)',
      'stats.views': 'Seitenaufrufe',
      'stats.unique': 'Eindeutige Besucher',
      'stats.itemsWorld': 'Erstellte Items (Welt)',
      'stats.yourVisits': 'Deine Besuche (dieser Browser)',
      'stats.unavailable': 'Statistik nicht verfügbar.',
      'stats.browser': 'Dein Browser',
      'stats.itemsLocal': 'Erstellte Items (lokal)',
      'instr.expanded': 'Ausführlich',
      'instr.simple': 'Einfach',
      'instr.loading': 'Anleitung wird geladen…',
      'banner.vc4': 'Aktualisiert für Loveless',
      'section.simple': 'Einfacher Builder',
      'section.guided': 'Geführter Builder',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Werkzeuge & Teile',
      'btn.copy': 'Kopieren',
      'btn.clear': 'Leeren',
      'btn.import': 'Importieren',
      'btn.delete': 'Löschen',
      'btn.apply': 'Anwenden',
      'btn.save': 'Speichern',
      'btn.refresh': 'Aktualisieren',
      'btn.start': 'Start',
      'label.itemType': 'Itemtyp',
      'label.manufacturer': 'Hersteller',
      'label.weaponType': 'Waffentyp',
      'label.itemLevel': 'Itemstufe',
      'label.rarity': 'Seltenheit (Stufe wählen)',
      'label.seed': 'Seed (optional)',
      'label.skin': 'Skin (optional)',
      'label.camo': 'Tarnung (optional)',
      'label.charName': 'Charaktername:',
      'label.difficulty': 'Schwierigkeit:',
      'label.charLevel': 'Charakterstufe:',
      'label.xp': 'Erfahrungspunkte:',
      'diff.easy': 'Leicht',
      'diff.normal': 'Normal',
      'diff.hard': 'Schwer',
      'yaml.statsHeading': 'Charakter-Stats-Editor:',
      'yaml.pasteHint': 'YAML einfügen, Datei laden oder .yaml / .yml / .sav hierher ziehen.',
      'gen.code': 'Generierter Item-Code',
      'gen.serial': 'Serial (BL-base85)',
      'gen.deser': 'Deserialisierter Code',
      'history.title': 'Erstellte Items (Verlauf)',
      'history.download': '.txt herunterladen',
      'history.close': 'Schließen',
      'picker.hint': 'UI-Sprache (auf diesem Gerät gespeichert)'
    }),
    pt: pack({
      'lang.label': 'Idioma',
      'anim.full': 'Anim. completa',
      'anim.none': 'Sem anim.',
      'theme.reset': 'Redefinir tema',
      'cta.importLong': 'Tem um código para importar/editar? Clique aqui',
      'cta.importShort': 'Importar / editar código',
      'cta.savLong': 'Usando .Sav/.yaml? Clique aqui',
      'cta.savShort': 'Abrir Save / YAML',
      'nav.issues': '💭 Problemas',
      'nav.stats': '📊 Estatísticas',
      'nav.instructions': '📄 Instruções',
      'nav.support': '🫶 Apoiar / Doar',
      'stats.title': 'Estatísticas ao vivo',
      'stats.sub': 'Totais globais (API PHP)',
      'stats.views': 'Visualizações',
      'stats.unique': 'Visitantes únicos',
      'stats.itemsWorld': 'Itens criados (mundo)',
      'stats.yourVisits': 'Suas visitas (este navegador)',
      'stats.unavailable': 'Estatísticas indisponíveis.',
      'stats.browser': 'Seu navegador',
      'stats.itemsLocal': 'Itens criados (local)',
      'instr.expanded': 'Completo',
      'instr.simple': 'Simples',
      'instr.loading': 'Carregando instruções…',
      'banner.vc4': 'Atualizado para Loveless',
      'section.simple': 'Construtor Simples',
      'section.guided': 'Construtor Guiado',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Ferramentas e peças',
      'btn.copy': 'Copiar',
      'btn.clear': 'Limpar',
      'btn.import': 'Importar',
      'btn.delete': 'Excluir',
      'btn.apply': 'Aplicar',
      'btn.save': 'Salvar',
      'btn.refresh': 'Atualizar',
      'btn.start': 'Iniciar',
      'label.itemType': 'Tipo de item',
      'label.manufacturer': 'Fabricante',
      'label.weaponType': 'Tipo de arma',
      'label.itemLevel': 'Nível do item',
      'label.rarity': 'Raridade (escolha o nível)',
      'label.seed': 'Seed (opcional)',
      'label.skin': 'Skin (opcional)',
      'label.camo': 'Camuflagem (opcional)',
      'label.charName': 'Nome do personagem:',
      'label.difficulty': 'Dificuldade:',
      'label.charLevel': 'Nível do personagem:',
      'label.xp': 'Pontos de experiência:',
      'diff.easy': 'Fácil',
      'diff.normal': 'Normal',
      'diff.hard': 'Difícil',
      'yaml.statsHeading': 'Editor de stats do personagem:',
      'yaml.pasteHint': 'Cole YAML, carregue um arquivo ou arraste .yaml / .yml / .sav aqui.',
      'gen.code': 'Código do item gerado',
      'gen.serial': 'Serial (BL-base85)',
      'gen.deser': 'Código desserializado',
      'history.title': 'Itens criados (histórico)',
      'history.download': 'Baixar .txt',
      'history.close': 'Fechar',
      'picker.hint': 'Idioma da interface (salvo neste dispositivo)'
    }),
    it: pack({
      'lang.label': 'Lingua',
      'anim.full': 'Anim. completa',
      'anim.none': 'Niente anim.',
      'theme.reset': 'Reimposta tema',
      'cta.importLong': 'Hai un codice da importare/modificare? Clicca qui',
      'cta.importShort': 'Importa / modifica codice',
      'cta.savLong': 'Usi .Sav/.yaml? Clicca qui',
      'cta.savShort': 'Apri Save / YAML',
      'nav.issues': '💭 Problemi',
      'nav.stats': '📊 Statistiche',
      'nav.instructions': '📄 Istruzioni',
      'nav.support': '🫶 Supporta / Dona',
      'stats.title': 'Statistiche live',
      'stats.sub': 'Totali globali (API PHP)',
      'stats.views': 'Visualizzazioni',
      'stats.unique': 'Visitatori unici',
      'stats.itemsWorld': 'Oggetti creati (mondo)',
      'stats.yourVisits': 'Le tue visite (questo browser)',
      'stats.unavailable': 'Statistiche non disponibili.',
      'stats.browser': 'Il tuo browser',
      'stats.itemsLocal': 'Oggetti creati (locale)',
      'instr.expanded': 'Completo',
      'instr.simple': 'Semplice',
      'instr.loading': 'Caricamento istruzioni…',
      'banner.vc4': 'Aggiornato per Loveless',
      'section.simple': 'Builder semplice',
      'section.guided': 'Builder guidato',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Strumenti e parti',
      'btn.copy': 'Copia',
      'btn.clear': 'Cancella',
      'btn.import': 'Importa',
      'btn.delete': 'Elimina',
      'btn.apply': 'Applica',
      'btn.save': 'Salva',
      'btn.refresh': 'Aggiorna',
      'btn.start': 'Avvia',
      'label.itemType': 'Tipo di oggetto',
      'label.manufacturer': 'Produttore',
      'label.weaponType': 'Tipo di arma',
      'label.itemLevel': "Livello dell'oggetto",
      'label.rarity': 'Rarità (scegli il livello)',
      'label.seed': 'Seed (opzionale)',
      'label.skin': 'Skin (opzionale)',
      'label.camo': 'Mimetica (opzionale)',
      'label.charName': 'Nome personaggio:',
      'label.difficulty': 'Difficoltà:',
      'label.charLevel': 'Livello personaggio:',
      'label.xp': 'Punti esperienza:',
      'diff.easy': 'Facile',
      'diff.normal': 'Normale',
      'diff.hard': 'Difficile',
      'yaml.statsHeading': 'Editor stats personaggio:',
      'yaml.pasteHint': 'Incolla YAML, carica un file o trascina qui .yaml / .yml / .sav.',
      'gen.code': 'Codice oggetto generato',
      'gen.serial': 'Serial (BL-base85)',
      'gen.deser': 'Codice deserializzato',
      'history.title': 'Oggetti creati (cronologia)',
      'history.download': 'Scarica .txt',
      'history.close': 'Chiudi',
      'picker.hint': "Lingua dell'interfaccia (salvata su questo dispositivo)"
    }),
    ru: pack({
      'lang.label': 'Язык',
      'anim.full': 'Полная аним.',
      'anim.none': 'Без аним.',
      'theme.reset': 'Сбросить тему',
      'cta.importLong': 'Есть код для импорта/правки? Нажмите сюда',
      'cta.importShort': 'Импорт / правка кода',
      'cta.savLong': 'Файл .Sav/.yaml? Нажмите сюда',
      'cta.savShort': 'Открыть Save / YAML',
      'nav.issues': '💭 Проблемы',
      'nav.stats': '📊 Статистика',
      'nav.instructions': '📄 Инструкции',
      'nav.support': '🫶 Поддержать / Донат',
      'stats.title': 'Живая статистика',
      'stats.sub': 'Глобальные итоги (PHP API)',
      'stats.views': 'Просмотры',
      'stats.unique': 'Уникальные посетители',
      'stats.itemsWorld': 'Создано предметов (мир)',
      'stats.yourVisits': 'Ваши визиты (этот браузер)',
      'stats.unavailable': 'Статистика недоступна.',
      'stats.browser': 'Ваш браузер',
      'stats.itemsLocal': 'Создано предметов (локально)',
      'instr.expanded': 'Полные',
      'instr.simple': 'Краткие',
      'instr.loading': 'Загрузка инструкций…',
      'banner.vc4': 'Обновлено для Loveless',
      'section.simple': 'Простой конструктор',
      'section.guided': 'Пошаговый конструктор',
      'section.yaml': 'Save / YAML',
      'section.tools': 'Инструменты и детали',
      'btn.copy': 'Копировать',
      'btn.clear': 'Очистить',
      'btn.import': 'Импорт',
      'btn.delete': 'Удалить',
      'btn.apply': 'Применить',
      'btn.save': 'Сохранить',
      'btn.refresh': 'Обновить',
      'btn.start': 'Старт',
      'label.itemType': 'Тип предмета',
      'label.manufacturer': 'Производитель',
      'label.weaponType': 'Тип оружия',
      'label.itemLevel': 'Уровень предмета',
      'label.rarity': 'Редкость (выберите уровень)',
      'label.seed': 'Seed (необязательно)',
      'label.skin': 'Скин (необязательно)',
      'label.camo': 'Камуфляж (необязательно)',
      'label.charName': 'Имя персонажа:',
      'label.difficulty': 'Сложность:',
      'label.charLevel': 'Уровень персонажа:',
      'label.xp': 'Очки опыта:',
      'diff.easy': 'Лёгкий',
      'diff.normal': 'Обычный',
      'diff.hard': 'Сложный',
      'yaml.statsHeading': 'Редактор статов персонажа:',
      'yaml.pasteHint': 'Вставьте YAML, загрузите файл или перетащите .yaml / .yml / .sav сюда.',
      'gen.code': 'Сгенерированный код предмета',
      'gen.serial': 'Серийник (BL-base85)',
      'gen.deser': 'Десериализованный код',
      'history.title': 'Созданные предметы (история)',
      'history.download': 'Скачать .txt',
      'history.close': 'Закрыть',
      'picker.hint': 'Язык интерфейса (сохраняется на этом устройстве)'
    }),
    zh: pack({
      'lang.label': '语言',
      'anim.full': '完整动画',
      'anim.none': '无动画',
      'theme.reset': '重置主题',
      'cta.importLong': '有代码要导入/编辑？点这里',
      'cta.importShort': '导入 / 编辑代码',
      'cta.savLong': '使用 .Sav/.yaml？点这里',
      'cta.savShort': '打开存档 / YAML',
      'nav.issues': '💭 问题反馈',
      'nav.stats': '📊 统计',
      'nav.instructions': '📄 使用说明',
      'nav.support': '🫶 支持 / 捐赠',
      'stats.title': '实时统计',
      'stats.sub': '全站合计（PHP API）',
      'stats.views': '页面浏览',
      'stats.unique': '独立访客',
      'stats.itemsWorld': '已制作物品（全站）',
      'stats.yourVisits': '你的访问（本浏览器）',
      'stats.unavailable': '统计不可用。',
      'stats.browser': '你的浏览器',
      'stats.itemsLocal': '已制作物品（本地）',
      'instr.expanded': '详细',
      'instr.simple': '简明',
      'instr.loading': '正在加载说明…',
      'banner.vc4': '已更新至 Loveless',
      'section.simple': '简易构筑器',
      'section.guided': '引导构筑器',
      'section.yaml': '存档 / YAML',
      'section.tools': '工具与零件',
      'btn.copy': '复制',
      'btn.clear': '清除',
      'btn.import': '导入',
      'btn.delete': '删除',
      'btn.apply': '应用',
      'btn.save': '保存',
      'btn.refresh': '刷新',
      'btn.start': '开始',
      'label.itemType': '物品类型',
      'label.manufacturer': '厂商',
      'label.weaponType': '武器类型',
      'label.itemLevel': '物品等级',
      'label.rarity': '稀有度（选择档位）',
      'label.seed': '种子（可选）',
      'label.skin': '皮肤（可选）',
      'label.camo': '迷彩（可选）',
      'label.charName': '角色名称：',
      'label.difficulty': '难度：',
      'label.charLevel': '角色等级：',
      'label.xp': '经验值：',
      'diff.easy': '简单',
      'diff.normal': '普通',
      'diff.hard': '困难',
      'yaml.statsHeading': '角色属性编辑器：',
      'yaml.pasteHint': '粘贴 YAML、加载文件，或将 .yaml / .yml / .sav 拖到此处。',
      'gen.code': '生成的物品代码',
      'gen.serial': '序列号（BL-base85）',
      'gen.deser': '反序列化代码',
      'history.title': '已制作物品（历史）',
      'history.download': '下载 .txt',
      'history.close': '关闭',
      'picker.hint': '界面语言（保存在此设备）'
    }),
    ja: pack({
      'lang.label': '言語',
      'anim.full': 'フルアニメ',
      'anim.none': 'アニメなし',
      'theme.reset': 'テーマをリセット',
      'cta.importLong': 'コードをインポート／編集しますか？ここをクリック',
      'cta.importShort': 'コードをインポート／編集',
      'cta.savLong': '.Sav/.yaml を使う？ここをクリック',
      'cta.savShort': 'Save / YAML を開く',
      'nav.issues': '💭 問題',
      'nav.stats': '📊 統計',
      'nav.instructions': '📄 使い方',
      'nav.support': '🫶 支援／寄付',
      'stats.title': 'ライブ統計',
      'stats.sub': '全体合計（PHP API）',
      'stats.views': 'ページビュー',
      'stats.unique': 'ユニーク訪問者',
      'stats.itemsWorld': '作成アイテム（全体）',
      'stats.yourVisits': 'あなたの訪問（このブラウザ）',
      'stats.unavailable': '統計を取得できません。',
      'stats.browser': 'このブラウザ',
      'stats.itemsLocal': '作成アイテム（ローカル）',
      'instr.expanded': '詳細',
      'instr.simple': '簡易',
      'instr.loading': '説明を読み込み中…',
      'banner.vc4': 'Loveless 対応更新',
      'section.simple': 'シンプルビルダー',
      'section.guided': 'ガイド付きビルダー',
      'section.yaml': 'Save / YAML',
      'section.tools': 'ツールとパーツ',
      'btn.copy': 'コピー',
      'btn.clear': 'クリア',
      'btn.import': 'インポート',
      'btn.delete': '削除',
      'btn.apply': '適用',
      'btn.save': '保存',
      'btn.refresh': '更新',
      'btn.start': '開始',
      'label.itemType': 'アイテム種類',
      'label.manufacturer': 'メーカー',
      'label.weaponType': '武器タイプ',
      'label.itemLevel': 'アイテムレベル',
      'label.rarity': 'レアリティ（段階を選択）',
      'label.seed': 'シード（任意）',
      'label.skin': 'スキン（任意）',
      'label.camo': '迷彩（任意）',
      'label.charName': 'キャラクター名：',
      'label.difficulty': '難易度：',
      'label.charLevel': 'キャラクターレベル：',
      'label.xp': '経験値：',
      'diff.easy': 'イージー',
      'diff.normal': 'ノーマル',
      'diff.hard': 'ハード',
      'yaml.statsHeading': 'キャラクターステータス編集：',
      'yaml.pasteHint': 'YAMLを貼る、ファイルを読み込む、または .yaml / .yml / .sav をここにドロップ。',
      'gen.code': '生成アイテムコード',
      'gen.serial': 'シリアル（BL-base85）',
      'gen.deser': 'デシリアライズコード',
      'history.title': '作成アイテム（履歴）',
      'history.download': '.txt をダウンロード',
      'history.close': '閉じる',
      'picker.hint': 'UI言語（この端末に保存）'
    }),
    ko: pack({
      'lang.label': '언어',
      'anim.full': '전체 애니',
      'anim.none': '애니 없음',
      'theme.reset': '테마 초기화',
      'cta.importLong': '가져오기/편집할 코드가 있나요? 여기를 클릭',
      'cta.importShort': '코드 가져오기 / 편집',
      'cta.savLong': '.Sav/.yaml 사용? 여기를 클릭',
      'cta.savShort': 'Save / YAML 열기',
      'nav.issues': '💭 문제',
      'nav.stats': '📊 통계',
      'nav.instructions': '📄 사용 설명',
      'nav.support': '🫶 후원 / 기부',
      'stats.title': '실시간 통계',
      'stats.sub': '전체 합계 (PHP API)',
      'stats.views': '페이지 조회',
      'stats.unique': '고유 방문자',
      'stats.itemsWorld': '제작 아이템 (전체)',
      'stats.yourVisits': '내 방문 (이 브라우저)',
      'stats.unavailable': '통계를 사용할 수 없습니다.',
      'stats.browser': '이 브라우저',
      'stats.itemsLocal': '제작 아이템 (로컬)',
      'instr.expanded': '자세히',
      'instr.simple': '간단',
      'instr.loading': '설명 불러오는 중…',
      'banner.vc4': 'Loveless 업데이트됨',
      'section.simple': '간단 빌더',
      'section.guided': '가이드 빌더',
      'section.yaml': 'Save / YAML',
      'section.tools': '도구 및 파츠',
      'btn.copy': '복사',
      'btn.clear': '지우기',
      'btn.import': '가져오기',
      'btn.delete': '삭제',
      'btn.apply': '적용',
      'btn.save': '저장',
      'btn.refresh': '새로고침',
      'btn.start': '시작',
      'label.itemType': '아이템 유형',
      'label.manufacturer': '제조사',
      'label.weaponType': '무기 유형',
      'label.itemLevel': '아이템 레벨',
      'label.rarity': '희귀도 (등급 선택)',
      'label.seed': '시드 (선택)',
      'label.skin': '스킨 (선택)',
      'label.camo': '위장 (선택)',
      'label.charName': '캐릭터 이름:',
      'label.difficulty': '난이도:',
      'label.charLevel': '캐릭터 레벨:',
      'label.xp': '경험치:',
      'diff.easy': '쉬움',
      'diff.normal': '보통',
      'diff.hard': '어려움',
      'yaml.statsHeading': '캐릭터 스탯 편집기:',
      'yaml.pasteHint': 'YAML을 붙여넣거나 파일을 불러오거나 .yaml / .yml / .sav 를 여기로 끌어다 놓으세요.',
      'gen.code': '생성된 아이템 코드',
      'gen.serial': '시리얼 (BL-base85)',
      'gen.deser': '역직렬화 코드',
      'history.title': '제작 아이템 (기록)',
      'history.download': '.txt 다운로드',
      'history.close': '닫기',
      'picker.hint': 'UI 언어 (이 기기에 저장됨)'
    })
  };

  var current = 'en';

  function hasLang(code) {
    return !!(code && DICTS[code]);
  }

  function t(key) {
    var d = DICTS[current] || EN;
    if (d[key] != null) return d[key];
    if (EN[key] != null) return EN[key];
    return key;
  }

  function rememberOriginal(el, attr) {
    var store = attr === 'text' ? 'data-i18n-src' : ('data-i18n-src-' + attr);
    if (!el.getAttribute(store)) {
      if (attr === 'text') el.setAttribute(store, el.textContent || '');
      else el.setAttribute(store, el.getAttribute(attr) || '');
    }
  }

  function applyNode(el) {
    if (!el || el.nodeType !== 1) return;
    var key = el.getAttribute('data-i18n');
    if (key) {
      rememberOriginal(el, 'text');
      el.textContent = t(key);
    }
    var titleKey = el.getAttribute('data-i18n-title');
    if (titleKey) {
      rememberOriginal(el, 'title');
      el.setAttribute('title', t(titleKey));
    }
    var phKey = el.getAttribute('data-i18n-placeholder');
    if (phKey) {
      rememberOriginal(el, 'placeholder');
      el.setAttribute('placeholder', t(phKey));
    }
    var ariaKey = el.getAttribute('data-i18n-aria');
    if (ariaKey) {
      rememberOriginal(el, 'aria-label');
      el.setAttribute('aria-label', t(ariaKey));
    }
  }

  function applyDom(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n], [data-i18n-title], [data-i18n-placeholder], [data-i18n-aria]');
    for (var i = 0; i < nodes.length; i++) applyNode(nodes[i]);
    try { document.documentElement.setAttribute('lang', current === 'zh' ? 'zh-Hans' : current); } catch (_) {}
  }

  function detectBrowserLang() {
    var nav = String((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    var short = nav.slice(0, 2);
    if (hasLang(short)) return short;
    return 'en';
  }

  function resolveInitialLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q) {
        q = String(q).toLowerCase();
        if (q === 'zh-cn' || q === 'zh-hans') q = 'zh';
        if (hasLang(q)) return q;
      }
    } catch (_) {}
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && hasLang(stored)) return stored;
    } catch (_) {}
    return detectBrowserLang();
  }

  function setLang(code, opts) {
    opts = opts || {};
    if (!hasLang(code)) code = 'en';
    current = code;
    if (opts.persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, code); } catch (_) {}
    }
    applyDom(document);
    var sel = document.getElementById('stxUiLangSelect');
    if (sel && sel.value !== code) sel.value = code;
    try {
      window.dispatchEvent(new CustomEvent('stx:ui-lang', { detail: { lang: code } }));
    } catch (_) {}
    return code;
  }

  function mountPicker() {
    if (document.getElementById('stxUiLangPicker')) return;
    var host = document.getElementById('stxTopControls');
    if (!host) return;
    var wrap = document.createElement('label');
    wrap.id = 'stxUiLangPicker';
    wrap.className = 'stx-lang-picker';
    wrap.setAttribute('title', t('picker.hint'));
    wrap.innerHTML =
      '<span class="stx-lang-picker__label" data-i18n="lang.label">Language</span>' +
      '<select id="stxUiLangSelect" class="stx-lang-picker__select" aria-label="Language"></select>';
    var sel = wrap.querySelector('select');
    for (var i = 0; i < LANGS.length; i++) {
      var opt = document.createElement('option');
      opt.value = LANGS[i].code;
      opt.textContent = LANGS[i].label;
      sel.appendChild(opt);
    }
    sel.value = current;
    sel.addEventListener('change', function () {
      setLang(sel.value);
      wrap.setAttribute('title', t('picker.hint'));
    });
    /* Sit near the end of the header controls — visible but not dominating CTAs. */
    host.appendChild(wrap);
    applyNode(wrap.querySelector('[data-i18n]'));
  }

  function boot() {
    current = resolveInitialLang();
    mountPicker();
    applyDom(document);
  }

  window.stxT = t;
  window.stxGetUiLang = function () { return current; };
  window.stxSetUiLang = setLang;
  window.stxApplyI18n = applyDom;
  window.STX_I18N_LANGS = LANGS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
