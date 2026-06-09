// src/scenes/MainMenuScene.js
export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.foodItems = [];
        this.goodCount = 0;
        this.badCount = 0;
        this.maxBad = 10;
        this.isActive = true;
        this.showBadFood = true;
        this.modal = null;
        this.menuButtons = [];
        this.menuLabels = [];
        this.menuBg = null;
    }

    preload() {
        // Загрузка ассетов Kenney (если есть)
        // Кнопка: положите в public/assets/ui/ файл button_rectangle_flat.png (из папки Blue/Default)
        this.load.image('btn', '/assets/ui/button_rectangle_flat.png');
        // Портрет мамы (опционально)
        this.load.image('momPortrait', '/assets/ui/mom.png');
        // Панель меню не загружаем — рисуем сами
    }

    create() {
        // ========== ФОН ==========
        this.add.rectangle(0, 0, 1100, 700, 0x9bd7f5).setOrigin(0,0);
        this.add.rectangle(0, 520, 1100, 180, 0x7cb542).setOrigin(0,0);
        // Облака
        for (let i = 0; i < 4; i++) {
            const cloud = this.add.container(100 + i * 250, 70);
            cloud.add(this.add.ellipse(0,0,70,50,0xffffff,0.85));
            cloud.add(this.add.ellipse(30,-15,55,45,0xffffff,0.85));
            cloud.add(this.add.ellipse(-30,-15,55,45,0xffffff,0.85));
        }

        // ========== МАМА ==========
        const momX = 320, momY = 480;
        this.add.ellipse(momX, momY+30, 100, 25, 0x000000, 0.2);
        if (this.textures.exists('momPortrait')) {
            this.add.image(momX, momY-30, 'momPortrait').setScale(0.7);
            this.mouthArea = this.add.ellipse(momX, momY-55, 28, 18, 0xffaaaa, 0.4);
        } else {
            // Рисованная мама (человек)
            this.add.rectangle(momX, momY, 95, 110, 0xc97e5a).setOrigin(0.5);
            this.add.rectangle(momX, momY+10, 85, 80, 0xb56a3a).setOrigin(0.5);
            this.add.rectangle(momX-50, momY-20, 25, 70, 0xfdd9b5).setOrigin(0.5);
            this.add.rectangle(momX+50, momY-20, 25, 70, 0xfdd9b5).setOrigin(0.5);
            this.add.rectangle(momX, momY-65, 25, 35, 0xfdd9b5).setOrigin(0.5);
            this.add.circle(momX, momY-95, 42, 0xfdd9b5);
            this.add.ellipse(momX-15, momY-120, 40, 35, 0x7a4a2a).setRotation(-0.3);
            this.add.ellipse(momX+15, momY-120, 40, 35, 0x7a4a2a).setRotation(0.3);
            this.add.ellipse(momX, momY-125, 45, 30, 0x7a4a2a);
            this.add.triangle(momX-8, momY-132, 0,0, 15,-10, 15,10, 0xff99cc);
            this.add.triangle(momX+8, momY-132, 0,0, -15,-10, -15,10, 0xff99cc);
            this.add.circle(momX, momY-132, 6, 0xff66aa);
            this.add.circle(momX-16, momY-105, 7, 0xffffff);
            this.add.circle(momX+16, momY-105, 7, 0xffffff);
            this.add.circle(momX-16, momY-105, 3, 0x2c2c2c);
            this.add.circle(momX+16, momY-105, 3, 0x2c2c2c);
            this.add.circle(momX-15, momY-107, 1, 0xffffff);
            this.add.circle(momX+17, momY-107, 1, 0xffffff);
            this.add.line(momX-22, momY-110, momX-27, momY-108, 0x2c2c2c, 2);
            this.add.line(momX+22, momY-110, momX+27, momY-108, 0x2c2c2c, 2);
            this.add.ellipse(momX-26, momY-92, 10, 6, 0xffaaaa, 0.5);
            this.add.ellipse(momX+26, momY-92, 10, 6, 0xffaaaa, 0.5);
            this.add.arc(momX, momY-87, 14, 0.1, Math.PI - 0.1, false, 0xcc6644, 2);
            this.mouthArea = this.add.ellipse(momX, momY-87, 22, 14, 0xffaaaa, 0.3);
        }
        this.add.text(momX, momY-150, '🍽️ МАМА', { fontSize: '28px', fill: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        // ========== СТАТИСТИКА ==========
        const statsX = 30, statsY = 40;
        const statsBg = this.add.rectangle(statsX, statsY, 280, 130, 0x5a3e2a, 0.85).setOrigin(0,0);
        statsBg.setStrokeStyle(2, 0xd4a373);
        this.obesityText = this.add.text(statsX+140, statsY+20, 'ОЖИРЕНИЕ', { fontSize: '18px', fill: '#ffcc88', stroke: '#000' }).setOrigin(0.5);
        const barX = statsX+10, barY = statsY+30, barW = 260, barH = 24;
        this.add.rectangle(barX, barY, barW, barH, 0x2c1a0e).setOrigin(0,0);
        this.obesityBar = this.add.rectangle(barX, barY, 0, barH, 0xff5555).setOrigin(0,0);
        this.goodText = this.add.text(statsX+15, statsY+65, '🥗 Полезной еды: 0', { fontSize: '20px', fill: '#fff', stroke: '#000' });
        this.badText = this.add.text(statsX+15, statsY+95, '🍔 Вредной еды: 0', { fontSize: '20px', fill: '#ffaa88', stroke: '#000' });

        // ========== МЕНЮ (справа) ==========
        const menuX = 760, menuY = 140;
        // Фон меню — рисуем сами (коричневый прямоугольник с обводкой)
        this.menuBg = this.add.rectangle(menuX-20, menuY-20, 300, 390, 0x4a2e1a, 0.95).setOrigin(0,0);
        this.menuBg.setStrokeStyle(3, 0xd4a373);
        // Тень
        this.add.rectangle(menuX-16, menuY-16, 300, 390, 0x000000, 0.3).setOrigin(0,0);
        
        // Кнопки (используем ассет Kenney, если есть)
        this.createButton(menuX+130, menuY+50, 'ИГРАТЬ', () => this.showModal('play'));
        this.createButton(menuX+130, menuY+150, 'НАСТРОЙКИ', () => this.showModal('settings'));
        this.createButton(menuX+130, menuY+250, 'О ПРОЕКТЕ', () => this.showModal('about'));

        // ========== ГЕНЕРАЦИЯ ЕДЫ ==========
        this.time.addEvent({ delay: 700, callback: this.spawnFood, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 50, callback: this.checkMouthCollision, callbackScope: this, loop: true });
    }

    createButton(x, y, text, callback, width=260, height=65, fontSize=28) {
        let btn;
        // Если текстура кнопки загружена — используем её
        if (this.textures.exists('btn')) {
            btn = this.add.image(x, y, 'btn').setDisplaySize(width, height).setInteractive({ cursor: 'pointer' });
        } else {
            // Иначе рисуем прямоугольник
            btn = this.add.rectangle(x, y, width, height, 0x3a7ca5).setInteractive({ cursor: 'pointer' });
            btn.setStrokeStyle(3, 0xffdd99);
        }
        // Тень
        this.add.rectangle(x+4, y+4, width, height, 0x000000, 0.3);
        // Текст
        const label = this.add.text(x, y, text, { fontSize: `${fontSize}px`, fill: '#ffffff', stroke: '#0044aa', strokeThickness: 3 }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setTint(0xddddff));
        btn.on('pointerout', () => btn.clearTint());
        btn.on('pointerdown', callback);
        this.menuButtons.push(btn);
        this.menuLabels.push(label);
    }

    spawnFood() {
        if (!this.isActive) return;
        const type = (Math.random() < 0.5 && this.showBadFood) ? 'bad' : 'good';
        const emoji = type === 'good' ? ['🥕','🍎','🥦','🍅','🍓','🍒'][Math.floor(Math.random()*6)] : ['🍔','🍕','🍟','🎂','🍩','🌭'][Math.floor(Math.random()*6)];
        const x = 120 + Math.random() * 600;
        const food = this.add.circle(x, 40, 26, type === 'good' ? 0xaaffaa : 0xffaaaa);
        food.setStrokeStyle(2, 0xffffff);
        const label = this.add.text(x, 40, emoji, { fontSize: '38px' }).setOrigin(0.5);
        food.setInteractive({ cursor: 'pointer' });
        food.label = label;
        food.type = type;
        
        food.on('pointerdown', () => {
            if (!this.isActive) return;
            this.eatFood(food, label);
        });
        
        this.tweens.add({
            targets: [food, label],
            y: 680,
            duration: 5000,
            ease: 'Linear',
            onComplete: () => {
                if (food.active) food.destroy();
                if (label.active) label.destroy();
                const idx = this.foodItems.findIndex(f => f.food === food);
                if (idx !== -1) this.foodItems.splice(idx,1);
            }
        });
        this.foodItems.push({ food, label, type });
    }

    eatFood(food, label) {
        this.goodCount++;
        this.goodText.setText(`🥗 Полезной еды: ${this.goodCount}`);
        if (food.type === 'bad') {
            this.badCount++;
            this.badText.setText(`🍔 Вредной еды: ${this.badCount}`);
            this.obesityBar.width = (this.badCount / this.maxBad) * 260;
            const effect = this.add.circle(this.mouthArea.x, this.mouthArea.y, 22, 0xff6666, 0.6);
            this.tweens.add({ targets: effect, alpha: 0, duration: 250, onComplete: () => effect.destroy() });
            if (this.badCount >= this.maxBad) this.endGame();
        } else {
            const effect = this.add.circle(this.mouthArea.x, this.mouthArea.y, 22, 0x66ff66, 0.6);
            this.tweens.add({ targets: effect, alpha: 0, duration: 250, onComplete: () => effect.destroy() });
        }
        const pop = this.add.text(this.mouthArea.x, this.mouthArea.y-45, 'Ням!', { fontSize: '32px', fill: '#fff', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
        this.tweens.add({ targets: pop, y: pop.y-55, alpha: 0, duration: 500, onComplete: () => pop.destroy() });
        food.destroy();
        label.destroy();
        const idx = this.foodItems.findIndex(f => f.food === food);
        if (idx !== -1) this.foodItems.splice(idx,1);
    }

    checkMouthCollision() {
        if (!this.isActive || !this.mouthArea) return;
        const mx = this.mouthArea.x, my = this.mouthArea.y;
        for (let i = 0; i < this.foodItems.length; i++) {
            const item = this.foodItems[i];
            if (!item.food.active) continue;
            const dist = Phaser.Math.Distance.Between(item.food.x, item.food.y, mx, my);
            if (dist < 30) {
                this.eatFood(item.food, item.label);
                break;
            }
        }
    }

    endGame() {
        this.isActive = false;
        this.time.removeAllEvents();
        this.foodItems.forEach(item => {
            if (item.food.active) item.food.destroy();
            if (item.label.active) item.label.destroy();
        });
        const bg = this.add.rectangle(0, 0, 1100, 700, 0x000000, 0.8).setDepth(100);
        const panel = this.add.rectangle(550, 350, 500, 250, 0x5a3e2a).setDepth(101);
        panel.setStrokeStyle(4, 0xd4a373);
        this.add.text(550, 280, '😭 МАМА ПОЛУЧИЛА ОЖИРЕНИЕ!', { fontSize: '32px', fill: '#ffaa66', stroke: '#000' }).setOrigin(0.5).setDepth(102);
        this.add.text(550, 340, 'Кормите её полезной едой!', { fontSize: '26px', fill: '#fff' }).setOrigin(0.5).setDepth(102);
        const restart = this.add.rectangle(550, 420, 220, 55, 0x3a7ca5).setInteractive().setDepth(102);
        restart.setStrokeStyle(2, 0xffdd99);
        this.add.text(550, 420, 'СЫГРАТЬ СНОВА', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5).setDepth(102);
        restart.on('pointerdown', () => this.scene.restart());
    }

    showModal(type) {
        if (this.modal) this.closeModal();
        
        // Скрываем меню
        this.menuButtons.forEach(btn => { btn.setVisible(false); btn.disableInteractive(); });
        this.menuLabels.forEach(lbl => lbl.setVisible(false));
        if (this.menuBg) this.menuBg.setVisible(false);
        
        const bg = this.add.rectangle(0, 0, 1100, 700, 0x000000, 0.85).setInteractive().setDepth(200);
        const panel = this.add.rectangle(550, 350, 540, 340, 0x5a3e2a).setDepth(201);
        panel.setStrokeStyle(3, 0xd4a373);
        
        if (type === 'play') {
            const content = '🚧 ПОЛНОЦЕННАЯ ИГРА В РАЗРАБОТКЕ 🚧\n\nСкоро здесь появится возможность\nсоревноваться с другими игроками!\n\nСпасибо за ожидание!';
            const contentText = this.add.text(550, 300, content, { fontSize: '24px', fill: '#fff', stroke: '#000', align: 'center', wordWrap: { width: 460 } }).setOrigin(0.5).setDepth(202);
            const closeBtn = this.add.rectangle(550, 500, 200, 50, 0x3a7ca5).setInteractive().setDepth(202);
            closeBtn.setStrokeStyle(2, 0xffdd99);
            const closeLabel = this.add.text(550, 500, 'ЗАКРЫТЬ', { fontSize: '28px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(203);
            closeBtn.on('pointerdown', () => this.closeModal());
            this.modal = { bg, panel, contentText, closeBtn, closeLabel };
        } 
        else if (type === 'settings') {
            const content = `⚙️ НАСТРОЙКИ ⚙️\n\nПоказывать вредную еду: ${this.showBadFood ? 'ВКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}`;
            const contentText = this.add.text(550, 260, content, { fontSize: '24px', fill: '#fff', stroke: '#000', align: 'center', wordWrap: { width: 460 } }).setOrigin(0.5).setDepth(202);
            const toggleBtn = this.add.rectangle(550, 370, 280, 55, 0x3a7ca5).setInteractive().setDepth(202);
            toggleBtn.setStrokeStyle(2, 0xffdd99);
            const toggleLabel = this.add.text(550, 370, this.showBadFood ? 'СКРЫТЬ ВРЕДНУЮ ЕДУ' : 'ПОКАЗАТЬ ВРЕДНУЮ ЕДУ', { fontSize: '26px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(203);
            toggleBtn.on('pointerdown', () => {
                this.showBadFood = !this.showBadFood;
                toggleLabel.setText(this.showBadFood ? 'СКРЫТЬ ВРЕДНУЮ ЕДУ' : 'ПОКАЗАТЬ ВРЕДНУЮ ЕДУ');
                contentText.setText(`⚙️ НАСТРОЙКИ ⚙️\n\nПоказывать вредную еду: ${this.showBadFood ? 'ВКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}`);
            });
            const closeBtn = this.add.rectangle(550, 500, 200, 50, 0x3a7ca5).setInteractive().setDepth(202);
            closeBtn.setStrokeStyle(2, 0xffdd99);
            const closeLabel = this.add.text(550, 500, 'ЗАКРЫТЬ', { fontSize: '28px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(203);
            closeBtn.on('pointerdown', () => this.closeModal());
            this.modal = { bg, panel, contentText, closeBtn, closeLabel, extra: [toggleBtn, toggleLabel] };
        } 
        else {
            const content = '📖 О ПРОЕКТЕ 📖\n\n«Мамулин обед» — прототип главного экрана.\n\nКликайте на еду, кормите маму.\nВредная еда вызывает ожирение!\n\nСделано с использованием Kenney UI assets.';
            const contentText = this.add.text(550, 300, content, { fontSize: '24px', fill: '#fff', stroke: '#000', align: 'center', wordWrap: { width: 460 } }).setOrigin(0.5).setDepth(202);
            const closeBtn = this.add.rectangle(550, 500, 200, 50, 0x3a7ca5).setInteractive().setDepth(202);
            closeBtn.setStrokeStyle(2, 0xffdd99);
            const closeLabel = this.add.text(550, 500, 'ЗАКРЫТЬ', { fontSize: '28px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(203);
            closeBtn.on('pointerdown', () => this.closeModal());
            this.modal = { bg, panel, contentText, closeBtn, closeLabel };
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.bg.destroy();
            this.modal.panel.destroy();
            if (this.modal.contentText) this.modal.contentText.destroy();
            this.modal.closeBtn.destroy();
            this.modal.closeLabel.destroy();
            if (this.modal.extra) {
                this.modal.extra.forEach(e => e.destroy());
            }
            this.modal = null;
        }
        this.menuButtons.forEach(btn => { btn.setVisible(true); btn.setInteractive(); });
        this.menuLabels.forEach(lbl => lbl.setVisible(true));
        if (this.menuBg) this.menuBg.setVisible(true);
    }
}