/* new-script.js - 热量管理模块 V5.1 (功能完善版) */

(function() {
    // 1. 状态管理
    const State = {
        goals: { 
            daily: 2000, 
            total: 10000,
            type: 'lose' // 'lose' (减脂/消耗目标) 或 'gain' (增肌/摄入目标)
        }, 
        photos: [null, null, null], 
        todayData: { intake: 0, burn: 0, net: 0 },
        totalData: { net: 0 } , // 总累计（注意这里如果原来没有逗号，记得加上逗号）

        // --- 在下面【新增】这些代码 ---
        items: [],           // 存放所有的词条数据
        manageFilter: 'all', // 当前词条管理的筛选状态：all/inc/dec
        isManageMode: false,  // 是否处于批量删除模式
        
        // --- 新增状态 ---
        statsTab: 'day', // day, week, month, year
        isStatsDeleteMode: false, // 统计页面的批量删除模式
        
        // --- 新增 ---
        searchQuery: '', // 用于存储搜索关键词
        
        calendarDate: new Date(), // 当前日历显示的月份
        selectedDateStr: null,    // 当前选中的日期 (用于显示列表)
        calColors: { inc: '#e8f5e9', dec: '#ffebee' } // 自定义颜色 (默认绿/粉背景)
    };

    // 2. SVG 图标
    const Icons = {
        back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
        pen: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
        home: `<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        list: `<svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
        chart: `<svg viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s4.07-10 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/></svg>`,
        fire: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.2 1-2.4 1-3.7.5 2.5 1 4.9 1 7.5z"></path></svg>`,
        plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        
        // --- 在下面【新增】这些代码 ---
        manage: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
        calendar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        right: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        food: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="8"></line><line x1="10" y1="1" x2="10" y2="8"></line><line x1="14" y1="1" x2="14" y2="8"></line></svg>`,
        run: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2l-7.08 7.08a6 6 0 0 0-1.66 4.77 12 12 0 0 0-3.69-1.92l-.94-1.54a12 12 0 0 0 5.09-2.28L22 2z"></path><path d="M5 21a2 2 0 0 1 0-4h3a2 2 0 0 1 2 2v2"></path><path d="M2 13h6v4H2z"></path></svg>`,
        
        // 新增删除图标
        trash: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        // 模式选择图标
        bolt: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        edit: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        
        // --- 新增心情图标 ---
        mood_happy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        mood_normal: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        mood_sad: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        mood_active: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
        mood_tired: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2h4"></path><path d="M12 2v20"></path><path d="M5.64 5.64l1.41 1.41"></path><path d="M18.36 18.36l-1.41-1.41"></path><path d="M2 12h4"></path><path d="M18 12h4"></path></svg>`,
        
        star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
        
        // 用于搜索栏的小图标
        search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        
        settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.29 1.07 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        left: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`
        
    };

    // ===================================
    // === 核心：初始化与渲染 ===
    // ===================================

    // 监听侧边栏入口
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item && item.dataset.page === 'calorie-page') {
            window.CalorieManager.init();
        }
    });

    window.CalorieManager = {
        
        async init() {
            // 显示热量页
            document.body.classList.add('calorie-page-active'); 
            const page = document.getElementById('calorie-page');
            if(page) {
                page.classList.add('active');
                page.style.display = 'flex'; // 确保 flex 布局生效
            }
            await this.loadData();
            this.renderHome();
        },

        // === 修复 1：退出功能 ===
        exit() {
            // 1. 移除特殊类名
            document.body.classList.remove('calorie-page-active');
            
            // 2. 隐藏热量页
            const page = document.getElementById('calorie-page');
            if(page) {
                page.classList.remove('active');
                page.style.display = 'none';
            }

            // 3. 强制唤醒日记主页 (防止黑屏)
            const diaryPage = document.getElementById('diary-page');
            const topBar = document.getElementById('top-bar');
            const bottomNav = document.querySelector('.bottom-nav');
            
            // 恢复其他页面的 active 状态
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            if(diaryPage) diaryPage.classList.add('active');
            
            // 恢复顶部和底部导航的显示
            if(topBar) {
                topBar.style.display = ''; 
                topBar.style.opacity = '';
                topBar.style.visibility = '';
                topBar.style.pointerEvents = '';
            }
            if(bottomNav) bottomNav.style.display = 'flex';

            // 更新底部导航选中状态
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            const diaryNav = document.querySelector('.nav-item[data-page="diary-page"]');
            if(diaryNav) diaryNav.classList.add('active');
        },

        async loadData() {
            const db = window.dbActions; 
            const sDaily = await db.get('calorieSettings', 'goal_daily');
            const sTotal = await db.get('calorieSettings', 'goal_total');
            const sType = await db.get('calorieSettings', 'goal_type'); // 新增类型
            const sPhotos = await db.get('calorieSettings', 'photos');
             // --- 新增：加载日历颜色 ---
            const sColors = await db.get('calorieSettings', 'calendar_colors');
            // 如果数据库有就用，没有就用默认的浅绿/浅红
            if (sColors && sColors.value) {
                State.calColors = sColors.value;
            } else {
                State.calColors = { inc: '#e8f5e9', dec: '#ffebee' }; // 默认值
            }
            
            if(sDaily) State.goals.daily = sDaily.value;
            if(sTotal) State.goals.total = sTotal.value;
            if(sType) State.goals.type = sType.value;
            if(sPhotos) State.photos = sPhotos.value;
            
            // --- 在这里【插入】新增代码 ---
            // 加载词条数据
            const items = await window.dbActions.getAll('calorieItems');
            State.items = items || []; 
            // --- 插入结束 ---
            
            const records = await db.getAll('calorieRecords');
            const today = new Date(); today.setHours(0,0,0,0);
            
            let todayInc = 0, todayDec = 0;
            let totalNet = 0;

            records.forEach(r => {
                const val = Number(r.value);
                // 总累计
                if(r.type === 'inc') totalNet += val; else totalNet -= val;
                // 今日数据
                if(r.timestamp >= today.getTime()) {
                    if(r.type === 'inc') todayInc += val; else todayDec += val;
                }
            });

            State.todayData = { intake: todayInc, burn: todayDec, net: todayInc - todayDec };
            State.totalData = { net: totalNet };
            State.records = records.filter(r => r.timestamp >= today.getTime()).sort((a,b) => b.timestamp - a.timestamp);
        },

        // === 渲染主页 (UI 融合版) ===
        async renderHome() {
            const container = document.getElementById('calorie-content-area');
            const profile = await window.dbActions.get('profile', 'userProfile') || {};
            
            // --- 计算逻辑 (今日) ---
            const g = State.goals;
            const t = State.todayData;
            
            let dailyProgress = 0;
            let dailyRemaining = 0;
            let dailyLabel = "";

            if (g.type === 'gain') { // 增肌/摄入目标
                // 目标是摄入 > 2000
                dailyRemaining = g.daily - t.net; // 还需要摄入多少
                dailyProgress = (t.net / g.daily) * 100;
                dailyLabel = "剩余需摄入";
            } else { // 减脂/消耗目标 (默认)
                // 目标是净值控制在 2000 以内 (或消耗掉2000? 简化为消耗/缺口)
                // 这里假设目标是：今日剩余可摄入额度
                dailyRemaining = g.daily - t.net;
                dailyProgress = (t.net / g.daily) * 100; 
                dailyLabel = "今日剩余额度";
            }
            if (dailyProgress < 0) dailyProgress = 0; if (dailyProgress > 100) dailyProgress = 100;

            // --- 计算逻辑 (总目标) ---
            let totalProgress = 0;
            let totalRemaining = g.total - Math.abs(State.totalData.net); 
            // 简单逻辑：累计净值的绝对值 / 总目标
            totalProgress = (Math.abs(State.totalData.net) / g.total) * 100;
            if (totalProgress > 100) totalProgress = 100;

            const html = `
                <div class="cal-top-nav">
                    <div class="cal-back-btn" onclick="window.CalorieManager.exit()">${Icons.back}</div>
                    <div style="font-size:12px; letter-spacing:2px; color:var(--cal-sub);">ABOUT ME</div>
                    <div style="width:40px;"></div>
                </div>

                <!-- 仿图 UI：个人信息区 -->
                <div class="cal-profile-header-ref" onclick="window.CalorieManager.openEditor()">
                    <!-- 头像 -->
                    <img src="${profile.avatar || 'https://via.placeholder.com/100'}" class="cal-ref-avatar">
                    
                    <!-- 渐变条 (姓名 + Tag) -->
                    <div class="cal-ref-name-bar">
                        <div class="cal-ref-name-text">${profile.name || 'User'}</div>
                        <div class="cal-ref-edit-tag">NAME</div>
                    </div>
                </div>

                <!-- 数据三列 -->
                <div class="cal-info-cols">
                    <div class="cal-info-item">
                        <div class="cal-info-label">${profile.id || 'ID'}</div>
                        <div class="cal-info-val">INTJ</div>
                    </div>
                    <div class="cal-info-item">
                        <div class="cal-info-label">ATTRIBUTES</div>
                        <div class="cal-info-val">${g.type === 'gain' ? '增肌' : '减脂'}</div>
                    </div>
                    <div class="cal-info-item">
                        <div class="cal-info-label">GOAL</div>
                        <div class="cal-info-val">${g.daily}</div>
                    </div>
                </div>

                <!-- 进度条区域 -->
                <div class="cal-progress-section">
                    <!-- 今日进度 -->
                    <div class="cal-progress-row">
                        <span class="cal-prog-label">${dailyLabel} (${g.daily})</span>
                        <span class="cal-prog-val">${dailyRemaining} kcal</span>
                    </div>
                    <div class="cal-progress-track">
                        <div class="cal-progress-fill ${g.type==='lose'?'reverse':''}" style="width: ${dailyProgress}%"></div>
                    </div>

                    <!-- 总目标进度 -->
                    <div class="cal-progress-row">
                        <span class="cal-prog-label">总计划进度 (${g.total})</span>
                        <span class="cal-prog-val">${Math.round(totalProgress)}%</span>
                    </div>
                    <div class="cal-progress-track">
                        <div class="cal-progress-fill" style="width: ${totalProgress}%; opacity: 0.6;"></div>
                    </div>
                </div>

                <!-- 相册小组件 (点击上传) -->
                <div class="cal-section-title" style="text-align:center;">Jottings —</div>
                <div class="cal-photo-widget-container">
                    ${this.renderPhotos()}
                </div>

                <!-- 近期记录列表 -->
                <div class="cal-section-title">TODAY'S LOG</div>
                <div style="padding-bottom:20px;">
                    ${State.records.length === 0 ? 
                        '<div style="text-align:center;color:var(--cal-sub);font-size:12px;padding:15px;">暂无记录</div>' : 
                        this.renderRecordList(State.records)
                    }
                </div>

                <!-- 底部悬浮加号 -->
                <div class="cal-fab-white" onclick="window.CalorieManager.handleFabClick()">
                    ${Icons.plus}
                </div>

                <!-- 【替换为】这一行代码 (调用我们马上要写的通用函数) -->
                ${this.renderDock()} 
            `;
            container.innerHTML = html;
        },
        
        // === 新增：渲染底部导航栏 (4个模块) ===
    renderDock() {
        const t = State.activeTab || 'home'; 
        const cls = (n) => `cal-dock-item ${t === n ? 'active' : ''}`;
        
        // 注意：这里去掉了任何内联样式 (style="...")
        // 所有的布局都由 CSS 的 .cal-bottom-dock 控制
        return `
            <div class="cal-bottom-dock">
                <div class="${cls('stats')}" onclick="window.CalorieManager.switchTab('stats')">${Icons.chart}</div>
                <div class="${cls('manage')}" onclick="window.CalorieManager.switchTab('manage')">${Icons.manage}</div>
                <div class="${cls('home')}" onclick="window.CalorieManager.switchTab('home')">${Icons.home}</div>
                <div class="${cls('calendar')}" onclick="window.CalorieManager.switchTab('calendar')">${Icons.calendar}</div>
            </div>
        `;
    },
    

    // === 新增：切换页面逻辑 ===
    switchTab(tabName) {
        State.activeTab = tabName;
        const container = document.getElementById('calorie-content-area');
        container.innerHTML = ''; // 清空当前页面
        
        // 根据 tabName 决定渲染什么
        if (tabName === 'home') {
            this.renderHome();
        } else if (tabName === 'manage') {
            this.renderManage(); // 马上就要写的词条管理页
        } else if (tabName === 'stats') {
            this.renderStats(); // <--- 关键！改成调用渲染函数
        } else if (tabName === 'calendar') {
            this.renderCalendar(); // <--- 关键修改：调用渲染函数
        }
    },
    
   // === 修复：渲染词条管理页面 (去除注释文字) ===
    renderManage() {
        const container = document.getElementById('calorie-content-area');
        const filter = State.manageFilter;
        const isManage = State.isManageMode;
        const search = State.searchQuery.toLowerCase();

        let displayItems = State.items;
        if (filter !== 'all') {
            displayItems = displayItems.filter(i => i.type === filter);
        }
        if (search) {
            displayItems = displayItems.filter(i => i.name.toLowerCase().includes(search));
        }

        const html = `
            <div class="cal-top-nav">
                <div class="cal-back-btn" onclick="window.CalorieManager.exit()">${Icons.back}</div>
                <div style="font-size:14px; font-weight:bold;">词条库</div>
                <div style="font-size:13px; color:var(--cal-accent); cursor:pointer;" onclick="window.CalorieManager.toggleManageMode()">
                    ${isManage ? '完成' : '管理'}
                </div>
            </div>

            <div class="cal-search-bar">
                <div class="cal-search-icon">${Icons.search}</div>
                <input type="text" class="cal-search-input" placeholder="搜索词条..." 
                       value="${State.searchQuery}" oninput="window.CalorieManager.onSearch(this.value)">
            </div>

            <div class="cal-manage-tabs">
                <div class="cal-manage-tab-item ${filter==='all'?'active':''}" onclick="window.CalorieManager.setFilter('all')">全部</div>
                <div class="cal-manage-tab-item ${filter==='inc'?'active':''}" onclick="window.CalorieManager.setFilter('inc')">摄入</div>
                <div class="cal-manage-tab-item ${filter==='dec'?'active':''}" onclick="window.CalorieManager.setFilter('dec')">消耗</div>
            </div>

            <div class="cal-items-list ${isManage ? 'manage-mode' : ''}">
                ${displayItems.length === 0 ? 
                    `<div style="text-align:center; color:var(--cal-sub); margin-top:50px; font-size:12px;">
                        ${search ? '无搜索结果' : '暂无词条，点击右下角添加'}
                    </div>` : 
                    displayItems.map(item => `
                        <div class="cal-list-item" onclick="window.CalorieManager.onItemClick(${item.id})">
                            <div class="cal-checkbox-circle item-check" data-id="${item.id}"></div>
                            
                            <!-- 纯净的图标显示逻辑 -->
                            <div class="cal-item-icon-box type-${item.type}" style="${item.icon && !item.icon.trim().startsWith('<') ? 'font-size:24px; background:transparent; border:1px solid rgba(0,0,0,0.05);' : ''}">
                                ${item.icon || (item.type==='inc' ? Icons.food : Icons.run)}
                            </div>
                            
                            <div class="cal-item-info">
                                <div class="cal-item-name">${item.name}</div>
                                <div class="cal-item-sub">
                                    <span class="cal-tag-pill">${item.type==='inc'?'增加':'减少'}</span>
                                    <span>${item.value} kcal</span>
                                </div>
                            </div>
                            
                            <div class="cal-item-action">${Icons.right}</div>
                        </div>
                    `).join('')
                }
            </div>

            ${isManage ? `
                <div class="cal-fab-white" style="width:auto; height:50px; padding:0 20px; border-radius:25px; right:50%; transform:translateX(50%); bottom:30px; background:var(--cal-card); border:1px solid #eee; color:#ff4d4f;" onclick="window.CalorieManager.deleteSelectedItems()">
                    删除选中
                </div>
            ` : `
                <div class="cal-fab-white" onclick="window.CalorieManager.handleFabClick()">
                    ${Icons.plus}
                </div>
                ${this.renderDock()}
            `}
        `;
        container.innerHTML = html;
        
        if(search) {
            const input = container.querySelector('.cal-search-input');
            input.focus();
            // 修复光标跳到前面的问题
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },
    
    

    // === 辅助功能函数 ===
    setFilter(f) {
        State.manageFilter = f;
        this.renderManage();
    },

    toggleManageMode() {
        State.isManageMode = !State.isManageMode;
        this.renderManage();
    },

    onItemClick(id) {
        if (State.isManageMode) {
            // 管理模式：勾选/取消勾选
            const el = document.querySelector(`.item-check[data-id="${id}"]`);
            if(el) el.classList.toggle('checked');
        } else {
            // 正常模式：打开编辑
            const item = State.items.find(i => i.id === id);
            this.openItemModal(item);
        }
    },
    
    // === 5. 打开词条弹窗 (支持 Emoji) ===
    openItemModal(itemToEdit = null) {
        const isEdit = !!itemToEdit;
        const item = itemToEdit || { name: '', type: 'inc', value: '', icon: '' };
        // 关键判断：没有icon或者不以<开头，都算Emoji模式
        const isEmoji = item.icon && !item.icon.trim().startsWith('<'); 
        
        // 图标列表 (确保补充了 icons)
        const iconList = [Icons.food, Icons.run, Icons.fire, Icons.chart, Icons.list, Icons.star, Icons.heart];

        const bodyHtml = `
            <label class="cal-label-sm">名称</label>
            <input type="text" id="cal-item-name" class="cal-input" value="${item.name}" placeholder="例如：牛奶">
            
            <label class="cal-label-sm">类型</label>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button class="cal-btn" style="flex:1; margin-top:0; ${item.type==='inc'?'background:var(--cal-text);color:#fff;':'background:#f0f0f0;color:#333;'}" 
                    onclick="window.CalorieManager.switchModalType('inc', this)">增加热量</button>
                <button class="cal-btn" style="flex:1; margin-top:0; ${item.type==='dec'?'background:var(--cal-text);color:#fff;':'background:#f0f0f0;color:#333;'}" 
                    onclick="window.CalorieManager.switchModalType('dec', this)">减少热量</button>
            </div>
            <input type="hidden" id="cal-item-type" value="${item.type}">

            <label class="cal-label-sm">数值 (Kcal)</label>
            <input type="number" id="cal-item-val" class="cal-input" value="${item.value}" placeholder="200">

            <label class="cal-label-sm">图标样式</label>
            <!-- 切换 Tab -->
            <div class="cal-icon-type-tabs">
                <div class="cal-icon-type-tab ${!isEmoji?'active':''}" id="tab-svg" onclick="window.CalorieManager.toggleIconType('svg')">图标库</div>
                <div class="cal-icon-type-tab ${isEmoji?'active':''}" id="tab-emoji" onclick="window.CalorieManager.toggleIconType('emoji')">Emoji</div>
            </div>

            <!-- SVG 选择区 -->
            <div id="panel-svg" class="cal-icon-grid" style="display:${!isEmoji?'grid':'none'}">
                ${iconList.map(svg => `
                    <div class="cal-icon-option ${item.icon === svg ? 'selected' : ''}" onclick="window.CalorieManager.selectIcon(this, 'svg')">
                        ${svg}
                    </div>
                `).join('')}
            </div>

            <!-- Emoji 输入区 -->
            <div id="panel-emoji" class="cal-emoji-input-wrapper" style="display:${isEmoji?'flex':'none'}">
                <input type="text" id="emoji-input" class="cal-emoji-input" value="${isEmoji?item.icon:''}" placeholder="输入一个表情 🍴" maxlength="2" oninput="window.CalorieManager.selectIcon(this, 'emoji')">
            </div>

            <input type="hidden" id="cal-item-icon" value='${item.icon || Icons.food}'>
        `;

        this.createModal(isEdit ? '编辑词条' : '新建词条', bodyHtml, 
            `<button class="cal-btn" onclick="window.CalorieManager.saveItem(${item.id || 'null'})">保存</button>`
        );
        
        // 强制初始化 Tab 状态
        this.toggleIconType(isEmoji ? 'emoji' : 'svg');
    },

    // 切换 图标/Emoji 面板
    toggleIconType(type) {
        document.getElementById('tab-svg').classList.toggle('active', type==='svg');
        document.getElementById('tab-emoji').classList.toggle('active', type==='emoji');
        document.getElementById('panel-svg').style.display = type==='svg'?'grid':'none';
        document.getElementById('panel-emoji').style.display = type==='emoji'?'flex':'none';
        
        const hiddenInput = document.getElementById('cal-item-icon');
        // 切换时重置 hidden input 的值，避免混淆
        if(type==='svg') {
            // 如果之前选过SVG就恢复，没选过就默认
            const selectedSvg = document.querySelector('.cal-icon-option.selected');
            hiddenInput.value = selectedSvg ? selectedSvg.innerHTML : Icons.food;
        } else {
            // 切换到 Emoji 模式，立即把输入框的值赋给 hidden
            hiddenInput.value = document.getElementById('emoji-input').value;
        }
    },
    
    
    

    // 弹窗内部：切换类型按钮样式
    switchModalType(type, btn) {
        document.getElementById('cal-item-type').value = type;
        // 重置所有按钮样式
        btn.parentElement.querySelectorAll('button').forEach(b => {
            b.style.background = '#f0f0f0'; b.style.color = '#333';
        });
        // 高亮当前按钮
        btn.style.background = 'var(--cal-text)'; btn.style.color = '#fff';
    },

    // 选中图标或输入Emoji
    selectIcon(el, type) {
        const hidden = document.getElementById('cal-item-icon');
        if (type === 'svg') {
            document.querySelectorAll('.cal-icon-option').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            hidden.value = el.innerHTML;
        } else {
            // Emoji 模式直接存值
            hidden.value = el.value;
        }
    },

    // === 修复：保存词条 (带提醒) ===
    async saveItem(id) {
        const name = document.getElementById('cal-item-name').value;
        const val = document.getElementById('cal-item-val').value;
        const type = document.getElementById('cal-item-type').value;
        const icon = document.getElementById('cal-item-icon').value;

        if(!name || !val) { alert("请填写完整信息"); return; }

        const newItem = { name, type, value: Number(val), icon };

        if (id) {
            newItem.id = id;
            await window.dbActions.put('calorieItems', newItem);
        } else {
            await window.dbActions.add('calorieItems', newItem);
        }

        // 修复：强制关闭当前弹窗
        this.closeModal(); 
        
        // 提醒
        alert('保存成功！');

        await this.loadData();
        this.renderManage();
    },
    
    
   // === 修复：批量删除词条 (修复按钮对齐) ===
    async deleteSelectedItems() {
        const checked = document.querySelectorAll('.item-check.checked');
        if(checked.length === 0) return;

        const body = `<div style="text-align:center; padding:10px 0;">确定要删除选中的 ${checked.length} 个词条吗？</div>`;
        
        const footer = `
            <div style="display:flex; gap:15px; width:100%;">
                <button class="cal-btn" style="flex:1; margin-top:0; background:var(--cal-bg); color:var(--cal-text); border:1px solid rgba(0,0,0,0.1);" 
                    onclick="window.CalorieManager.closeModal()">取消</button>
                <button class="cal-btn" style="flex:1; margin-top:0; background:#ff4d4f; color:#fff;" 
                    onclick="window.CalorieManager.confirmDeleteItems()">删除</button>
            </div>
        `;

        this.createModal('删除词条', body, footer);
    },

    // 补充：确认删除词条的执行函数
    async confirmDeleteItems() {
        const checked = document.querySelectorAll('.item-check.checked');
        for(const el of checked) {
            await window.dbActions.delete('calorieItems', Number(el.dataset.id));
        }
        State.isManageMode = false;
        this.closeModal();
        await this.loadData();
        this.renderManage();
    },
    
    
   // === 核心逻辑：悬浮球点击分发 (修复版) ===
    handleFabClick() {
        const tab = State.activeTab || 'home';
        
        // 确保 tab 名字完全匹配 (之前可能是 'manage'，但状态里可能是其他值)
        if (tab === 'manage') {
            // 在词条管理页 -> 打开新增词条弹窗
            this.openItemModal(); 
        } else {
            // 在统计页/主页 -> 打开模式选择
            this.openRecordModeSelector();
        }
    },

        // === 2. 模式选择弹窗 (仿图二两个大卡片) ===
        openRecordModeSelector() {
            const html = `
                <div class="cal-mode-select-container">
                    <div class="cal-mode-card" onclick="window.CalorieManager.startQuickRecordFlow()">
                        <div class="cal-mode-icon" style="color:#8eadd1; background:rgba(142, 173, 209, 0.1);">
                            ${Icons.bolt}
                        </div>
                        <div class="cal-mode-info">
                            <h4>词条快速记录</h4>
                            <p>选择预设词条，自动填入</p>
                        </div>
                    </div>

                    <div class="cal-mode-card" onclick="window.CalorieManager.startDirectRecordFlow()">
                        <div class="cal-mode-icon" style="color:#e0a0a0; background:rgba(224, 160, 160, 0.1);">
                            ${Icons.pen}
                        </div>
                        <div class="cal-mode-info">
                            <h4>临时直接记录</h4>
                            <p>手动输入，仅计入统计</p>
                        </div>
                    </div>
                </div>
            `;
            // 使用我们刚写的 createModal
            this.createModal('选择记录方式', html, 
                `<button class="cal-btn" style="background:#f5f5f5;color:#999;margin-top:0;" onclick="window.CalorieManager.closeModal()">取消</button>`
            );
        },

        // === 3. 流程A：快速记录 (选词条 -> 确认表单) ===
        startQuickRecordFlow() {
            // 第一步：展示词条列表供选择
            const itemsHtml = State.items.map(item => `
                <div class="cal-list-item" onclick="window.CalorieManager.openRecordForm('quick', ${item.id})">
                    <div class="cal-item-icon-box type-${item.type}">
                        ${item.icon || Icons.food}
                    </div>
                    <div class="cal-item-info">
                        <div class="cal-item-name">${item.name}</div>
                        <div class="cal-item-sub">
                            <span class="cal-tag-pill">${item.type==='inc'?'增加':'减少'}</span>
                            <span>${item.value} kcal</span>
                        </div>
                    </div>
                    <div class="cal-item-action">${Icons.plus}</div>
                </div>
            `).join('') || '<div style="text-align:center;padding:20px;color:#999;">暂无词条，请先去“词条库”添加</div>';

            const body = `<div class="cal-items-list" style="max-height:50vh;overflow-y:auto;">${itemsHtml}</div>`;
            this.createModal('选择词条', body, 
                `<button class="cal-btn" style="background:#f5f5f5;color:#999;" onclick="window.CalorieManager.openRecordModeSelector()">返回</button>`
            );
        },

        // === 4. 流程B：直接记录 (空表单) ===
        startDirectRecordFlow() {
            this.openRecordForm('direct', null);
        },

        // === 5. 通用记录表单 (核心 UI) ===
        // mode: 'quick' 或 'direct'
        // itemId: 如果是 quick 模式，传入选中的词条ID
        openRecordForm(mode, itemId, recordToEdit = null) {
             let initialData = { name: '', value: '', type: 'inc', mood: 'happy' };
             
             // 只有 edit 模式才填充数据
        if (mode === 'edit' && recordToEdit) {
            initialData = { ...recordToEdit };
        } else
            
            if (mode === 'quick' && itemId) {
                const item = State.items.find(i => i.id === itemId);
                if (item) initialData = { name: item.name, value: item.value, type: item.type };
            }

            // 心情图标列表
            const moods = [
                {id:'happy', icon:Icons.mood_happy},
                {id:'normal', icon:Icons.mood_normal},
                {id:'active', icon:Icons.mood_active},
                {id:'tired', icon:Icons.mood_tired},
                {id:'sad', icon:Icons.mood_sad}
            ];

            const body = `
                <!-- 1. 名称 (自动带入或手填) -->
                <label class="cal-label-sm">项目名称</label>
                <input type="text" id="rec-name" class="cal-input" value="${initialData.name}" ${mode==='quick'?'readonly style="opacity:0.7"':''}>

                <!-- 2. 类型切换 (如果是快速模式则锁定) -->
                <label class="cal-label-sm">类型</label>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="cal-btn" style="flex:1; margin-top:0; ${initialData.type==='inc'?'background:var(--cal-text);color:#fff;':'background:#f0f0f0;color:#333;'}" 
                        ${mode==='direct' ? `onclick="window.CalorieManager.toggleRecType('inc', this)"` : ''}>增加热量</button>
                    <button class="cal-btn" style="flex:1; margin-top:0; ${initialData.type==='dec'?'background:var(--cal-text);color:#fff;':'background:#f0f0f0;color:#333;'}" 
                        ${mode==='direct' ? `onclick="window.CalorieManager.toggleRecType('dec', this)"` : ''}>减少热量</button>
                </div>
                <input type="hidden" id="rec-type" value="${initialData.type}">

                <!-- 3. 数值 (自动带入或手填) -->
                <label class="cal-label-sm">热量数值 (Kcal)</label>
                <input type="number" id="rec-val" class="cal-input" value="${initialData.value}" ${mode==='quick'?'readonly style="opacity:0.7"':''}>

                <!-- 4. 心情选择 (必选) -->
                <label class="cal-label-sm">此刻心情</label>
                <div class="cal-mood-grid">
                    ${moods.map((m, i) => `
                        <div class="cal-mood-item ${i===0?'selected':''}" onclick="window.CalorieManager.selectMood(this, '${m.id}')">
                            ${m.icon}
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="rec-mood" value="happy">
            `;

            this.createModal(mode === 'quick' ? '确认记录' : '记一笔', body, 
                `<button class="cal-btn" onclick="window.CalorieManager.saveRecord(${recordToEdit ? recordToEdit.id : 'null'})">完成</button>`
            );
        },

        // 表单交互：切换类型
        toggleRecType(type, btn) {
            document.getElementById('rec-type').value = type;
            btn.parentElement.querySelectorAll('button').forEach(b => {
                b.style.background = '#f0f0f0'; b.style.color = '#333';
            });
            btn.style.background = 'var(--cal-text)'; btn.style.color = '#fff';
        },

        // 表单交互：选择心情
        selectMood(el, moodId) {
            document.querySelectorAll('.cal-mood-item').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            document.getElementById('rec-mood').value = moodId;
        },

        // === 6. 保存记录 ===
        async saveRecord(idToUpdate = null) {
            const name = document.getElementById('rec-name').value;
            const val = document.getElementById('rec-val').value;
            const type = document.getElementById('rec-type').value;
            const mood = document.getElementById('rec-mood').value;

            if(!name || !val) { alert("请填写完整信息"); return; }

            const newRecord = {
            timestamp: idToUpdate ? (State.records.find(r=>r.id===idToUpdate).timestamp) : Date.now(), // 如果是编辑，保持原时间
            name: name,
            type: type,
            value: Number(val),
            mood: mood
        };

            if (idToUpdate) {
            newRecord.id = idToUpdate;
            await window.dbActions.put('calorieRecords', newRecord); // 更新
        } else {
            await window.dbActions.add('calorieRecords', newRecord); // 新增
        }
            
            this.closeModal(); // 关闭弹窗
            
            // 刷新数据和界面
            await this.loadData();
            if(State.activeTab === 'home') this.renderHome();
            else this.renderStats();
        },
  
    
   // === 核心：渲染数据统计页面 (带搜索) ===
    renderStats() {
        const container = document.getElementById('calorie-content-area');
        const tab = State.statsTab;
        const isDelete = State.isStatsDeleteMode;
        const search = State.searchQuery.toLowerCase(); // 获取搜索词

        // 1. 数据筛选：按搜索词过滤
        let displayRecords = State.records;
        if (search) {
            displayRecords = displayRecords.filter(r => r.name.toLowerCase().includes(search));
        }
        
        // 计算总计 (基于筛选后的数据)
        let totalInc = 0, totalDec = 0;
        displayRecords.forEach(r => {
            if(r.type==='inc') totalInc += r.value; else totalDec += r.value;
        });
        const totalNet = totalInc - totalDec;

        // 2. 按日期分组
        const groups = {};
        displayRecords.forEach(r => {
            const dateStr = new Date(r.timestamp).toDateString();
            if(!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(r);
        });

        let timelineHtml = '';
        Object.keys(groups).forEach(dateStr => {
            const dateObj = new Date(dateStr);
            const dayNum = dateObj.getDate();
            const weekDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            groups[dateStr].forEach((r, index) => {
                const isSameDay = index > 0;
                
                timelineHtml += `
                    <div class="cal-timeline-item ${r.type==='dec'?'type-dec':''} ${isSameDay?'same-day':''}" onclick="window.CalorieManager.onStatItemClick(${r.id})" ondblclick="window.CalorieManager.openEditRecordModal(${r.id})">
                        <div class="cal-tl-date">
                            <div class="cal-tl-day-num">${dayNum}</div>
                            <div class="cal-tl-day-week">${weekDay}</div>
                        </div>
                        <div class="cal-tl-node"></div>
                        <div class="cal-tl-card">
                            <div class="cal-tl-checkbox stat-check" data-id="${r.id}"></div>
                            <div class="cal-tl-icon" style="${!r.mood.startsWith('<') ? 'font-size:20px;background:transparent;' : ''}">
                                ${/* 这里的图标逻辑可以优化，暂时沿用之前的，或者你可以存 icon */ r.type==='inc' ? Icons.food : Icons.run}
                            </div>
                            <div class="cal-tl-info">
                                <div class="cal-tl-title">${r.name}</div>
                                <div class="cal-tl-val ${r.type}">${r.type==='inc'?'+':'-'}${r.value}</div>
                            </div>
                            <div class="cal-tl-meta">
                                <div class="cal-tl-time">${new Date(r.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                                <div class="cal-tl-tag">${r.type==='inc'?'摄入':'消耗'}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        });

        const html = `
            <div class="cal-top-nav">
                <div class="cal-back-btn" onclick="window.CalorieManager.switchTab('home')">${Icons.back}</div>
                <div style="font-weight:bold; font-size:18px;">数据统计</div>
                <div style="width:30px; height:30px; display:flex; align-items:center; justify-content:center; color:var(--cal-sub); cursor:pointer;" 
                     onclick="window.CalorieManager.toggleStatsDelete()">
                    ${isDelete ? '完成' : Icons.trash}
                </div>
            </div>

            <!-- 新增：搜索栏 -->
            <div class="cal-search-bar">
                <div class="cal-search-icon">${Icons.search}</div>
                <input type="text" class="cal-search-input" placeholder="搜索记录..." 
                       value="${State.searchQuery}" oninput="window.CalorieManager.onSearch(this.value)">
            </div>

            <div class="cal-stat-header">
                <div class="cal-stat-toggle-box">
                    <div class="cal-stat-toggle-item ${tab==='day'?'active':''}" onclick="window.CalorieManager.setStatsTab('day')">日</div>
                    <div class="cal-stat-toggle-item ${tab==='week'?'active':''}" onclick="window.CalorieManager.setStatsTab('week')">周</div>
                    <div class="cal-stat-toggle-item ${tab==='month'?'active':''}" onclick="window.CalorieManager.setStatsTab('month')">月</div>
                    <div class="cal-stat-toggle-item ${tab==='year'?'active':''}" onclick="window.CalorieManager.setStatsTab('year')">年</div>
                </div>

                <div class="cal-stat-summary-card">
                    <div class="cal-stat-sum-item">
                        <div class="cal-stat-sum-label">总摄入</div>
                        <div class="cal-stat-sum-val">${totalInc}</div>
                    </div>
                    <div class="cal-stat-sum-item">
                        <div class="cal-stat-sum-label">总消耗</div>
                        <div class="cal-stat-sum-val">${totalDec}</div>
                    </div>
                    <div class="cal-stat-sum-item">
                        <div class="cal-stat-sum-label">净热量</div>
                        <div class="cal-stat-sum-val net">${totalNet > 0 ? '+'+totalNet : totalNet}</div>
                    </div>
                </div>
            </div>

            <div class="cal-timeline-container ${isDelete ? 'batch-delete-mode' : ''}">
                <div class="cal-timeline-line"></div>
                ${timelineHtml || '<div style="text-align:center;color:#ccc;margin-top:50px;">暂无数据</div>'}
            </div>

            ${isDelete ? `
                <div class="cal-fab-white" style="width:auto; height:50px; padding:0 20px; border-radius:25px; right:50%; transform:translateX(50%); bottom:30px; background:var(--cal-card); border:1px solid #eee; color:#ff4d4f;" onclick="window.CalorieManager.deleteStatsItems()">
                    删除选中记录
                </div>
            ` : `
                <div class="cal-fab-white" onclick="window.CalorieManager.handleFabClick()">
                    ${Icons.plus}
                </div>
                ${this.renderDock()}
            `}
        `;
        container.innerHTML = html;
        
        if(search) {
            const input = container.querySelector('.cal-search-input');
            input.focus();
        }
    },
    
    // === 搜索输入处理 ===
    onSearch(val) {
        State.searchQuery = val;
        // 根据当前页面刷新
        if(State.activeTab === 'manage') this.renderManage();
        else if(State.activeTab === 'stats') this.renderStats();
    },




    // === 统计页辅助函数 ===
    setStatsTab(t) { State.statsTab = t; this.renderStats(); },
    
    toggleStatsDelete() { State.isStatsDeleteMode = !State.isStatsDeleteMode; this.renderStats(); },
    
    onStatItemClick(id) {
        if(State.isStatsDeleteMode) {
            const el = document.querySelector(`.stat-check[data-id="${id}"]`);
            if(el) el.classList.toggle('checked');
        }
    },

    // === 修复：批量删除记录 (修复按钮对齐) ===
    deleteStatsItems() {
        const checked = document.querySelectorAll('.stat-check.checked');
        if(checked.length === 0) return;

        const body = `<div style="text-align:center; padding:10px 0;">
            <p style="font-size:16px; margin-bottom:5px;">确定要删除选中的 ${checked.length} 条记录吗？</p>
            <span style="font-size:12px;color:#999">此操作无法撤销</span>
        </div>`;
        
        // 关键修改：底部按钮包裹在 flex 容器中
        const footer = `
            <div style="display:flex; gap:15px; width:100%;">
                <button class="cal-btn" style="flex:1; margin-top:0; background:var(--cal-bg); color:var(--cal-text); border:1px solid rgba(0,0,0,0.1);" 
                    onclick="window.CalorieManager.closeModal()">取消</button>
                <button class="cal-btn" style="flex:1; margin-top:0; background:#ff4d4f; color:#fff;" 
                    onclick="window.CalorieManager.confirmDeleteStats()">删除</button>
            </div>
        `;
        
        this.createModal('确认删除', body, footer);
    },

    // 真正的删除执行函数
    async confirmDeleteStats() {
        const checked = document.querySelectorAll('.stat-check.checked');
        for(const el of checked) {
            await window.dbActions.delete('calorieRecords', Number(el.dataset.id));
        }
        State.isStatsDeleteMode = false;
        this.closeModal(); // 关闭确认弹窗
        await this.loadData();
        this.renderStats();
    },
     
     
     // === 新增：编辑单条记录 ===
    openEditRecordModal(id) {
        const record = State.records.find(r => r.id === id);
        if(!record) return;
        
        // 复用 openRecordForm，传入 'edit' 模式和数据
        this.openRecordForm('edit', null, record);
    },

// === 核心：渲染日历页面 ===
    renderCalendar() {
     // 1. 先应用颜色样式
        this.applyCalendarStyles();
        const container = document.getElementById('calorie-content-area');
        const currDate = State.calendarDate;
        const year = currDate.getFullYear();
        const month = currDate.getMonth(); // 0-11
        
        // 计算当月天数
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayWeek = new Date(year, month, 1).getDay(); // 0(周日)-6
        
        // 准备数据
        const dayData = {}; // { "1": {net: 500, type: 'inc'}, ... }
        State.records.forEach(r => {
            const d = new Date(r.timestamp);
            if(d.getFullYear() === year && d.getMonth() === month) {
                const day = d.getDate();
                if(!dayData[day]) dayData[day] = { inc:0, dec:0 };
                if(r.type === 'inc') dayData[day].inc += r.value;
                else dayData[day].dec += r.value;
            }
        });

        // 生成网格 HTML
        let gridHtml = '';
        // 空白填充
        for(let i=0; i<firstDayWeek; i++) gridHtml += `<div class="cal-day-cell empty"></div>`;
        
        // 日期填充
        for(let d=1; d<=daysInMonth; d++) {
            const data = dayData[d] || {inc:0, dec:0};
            const net = data.inc - data.dec;
            let statusClass = 'status-zero';
            if(net > 0) statusClass = 'status-inc';
            else if(net < 0) statusClass = 'status-dec';
            
            const isSelected = State.selectedDateStr === `${year}-${month}-${d}`;
            
            gridHtml += `
                <div class="cal-day-cell ${statusClass} ${isSelected?'selected':''}" onclick="window.CalorieManager.selectDate(${d})">
                    <div class="cal-day-num">${d}</div>
                    ${net !== 0 ? `<div class="cal-day-val">${net>0?'+':''}${net}</div>` : ''}
                </div>
            `;
        }

        const html = `
            <div class="cal-top-nav">
                <!-- 返回：退出模块 -->
                <div class="cal-back-btn" onclick="window.CalorieManager.exit()">${Icons.back}</div>
                <div style="font-size:16px; font-weight:bold;">每日记录</div>
                <!-- 设置：自定义颜色 -->
                <div style="width:30px; height:30px; display:flex; align-items:center; justify-content:center; color:var(--cal-sub); cursor:pointer;" 
                     onclick="window.CalorieManager.openCalendarSettings()">
                    ${Icons.settings}
                </div>
            </div>

            <!-- 日历主体 -->
            <div class="cal-calendar-wrapper">
                <div class="cal-calendar-header">
                    <div class="cal-month-nav" onclick="window.CalorieManager.changeMonth(-1)">${Icons.left}</div>
                    <div class="cal-month-title">${year}年 ${month+1}月</div>
                    <div class="cal-month-nav" onclick="window.CalorieManager.changeMonth(1)">${Icons.right}</div>
                </div>
                
                <div class="cal-week-row">
                    <div class="cal-week-day">日</div><div class="cal-week-day">一</div><div class="cal-week-day">二</div>
                    <div class="cal-week-day">三</div><div class="cal-week-day">四</div><div class="cal-week-day">五</div><div class="cal-week-day">六</div>
                </div>
                
                <div class="cal-days-grid">${gridHtml}</div>
            </div>

            <!-- 下方详情列表 (如果有选中日期) -->
            ${State.selectedDateStr ? this.renderDayDetail() : ''}

            ${this.renderDock()}
        `;
        container.innerHTML = html;
    },

    // === 日历辅助函数 ===
    changeMonth(delta) {
        const d = State.calendarDate;
        d.setMonth(d.getMonth() + delta);
        State.calendarDate = new Date(d); // 触发刷新
        State.selectedDateStr = null; // 切换月份取消选中
        this.renderCalendar();
    },

    selectDate(day) {
        const d = State.calendarDate;
        State.selectedDateStr = `${d.getFullYear()}-${d.getMonth()}-${day}`;
        this.renderCalendar(); // 重新渲染以显示下方列表
    },

    // 渲染选中日期的详情列表
    renderDayDetail() {
        const [y, m, d] = State.selectedDateStr.split('-').map(Number);
        const targetStart = new Date(y, m, d).getTime();
        const targetEnd = new Date(y, m, d+1).getTime();
        
        const list = State.records.filter(r => r.timestamp >= targetStart && r.timestamp < targetEnd);
        
        if (list.length === 0) return `<div style="text-align:center;color:#ccc;margin-top:20px;">当日无记录</div>`;

        let html = `
            <div class="cal-detail-list-container">
                <div class="cal-detail-header">
                    <span>${m+1}月${d}日 明细</span>
                    <span>${list.length} 条记录</span>
                </div>
        `;
        
        list.forEach(r => {
            html += `
                <div class="cal-flow-card ${r.type==='inc'?'type-inc':'type-dec'}" ondblclick="window.CalorieManager.openEditRecordModal(${r.id})">
                    <div class="cal-flow-content">
                        <div class="cal-flow-name">${r.name}</div>
                        <div class="cal-flow-time">${new Date(r.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} · ${r.mood||'ok'}</div>
                    </div>
                    <div class="cal-flow-val" style="color:${r.type==='inc'?'var(--cal-accent)':'var(--cal-accent-dec)'}">
                        ${r.type==='inc'?'+':'-'}${r.value}
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    },

    // === 修复：日历颜色设置 (美化 + 真实保存) ===
    openCalendarSettings() {
        const { inc, dec } = State.calColors;
        
        const body = `
            <div class="cal-color-picker-row">
                <div>
                    <div style="font-size:14px; font-weight:bold;">摄入达标 (增加)</div>
                    <div style="font-size:12px; color:var(--cal-sub);">日历格子的背景色</div>
                </div>
                <div class="cal-color-circle" style="background-color:${inc}">
                    <input type="color" id="picker-inc" value="${inc}" oninput="this.parentElement.style.backgroundColor=this.value">
                </div>
            </div>

            <div class="cal-color-picker-row">
                <div>
                    <div style="font-size:14px; font-weight:bold;">消耗/超标 (减少)</div>
                    <div style="font-size:12px; color:var(--cal-sub);">日历格子的背景色</div>
                </div>
                <div class="cal-color-circle" style="background-color:${dec}">
                    <input type="color" id="picker-dec" value="${dec}" oninput="this.parentElement.style.backgroundColor=this.value">
                </div>
            </div>
        `;

        this.createModal('日历显示设置', body, 
            `<button class="cal-btn" onclick="window.CalorieManager.saveCalendarColors()">保存设置</button>`
        );
    },

    // 保存颜色并刷新
    async saveCalendarColors() {
        const inc = document.getElementById('picker-inc').value;
        const dec = document.getElementById('picker-dec').value;
        
        State.calColors = { inc, dec };
        
        // 存入数据库
        await window.dbActions.put('calorieSettings', { key: 'calendar_colors', value: State.calColors });
        
        // 关闭弹窗并刷新日历
        this.closeModal();
        this.renderCalendar();
    },
    
    
    // === 核心：应用日历颜色到 CSS 变量 ===
    applyCalendarStyles() {
        const { inc, dec } = State.calColors;
        // 动态生成样式标签
        let styleTag = document.getElementById('cal-dynamic-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'cal-dynamic-styles';
            document.head.appendChild(styleTag);
        }
        
        // 覆盖 new-style.css 里的默认颜色
        // 注意：这里设置的是背景色，文字颜色我让它自动变深一点，看起来更协调
        styleTag.textContent = `
            .cal-day-cell.status-inc { background-color: ${inc} !important; color: #2e7d32; }
            .cal-day-cell.status-dec { background-color: ${dec} !important; color: #c62828; }
        `;
    },
    

        // === 修复 3：相册分散 ===
        renderPhotos() {
            // 加大偏移量，让它们分得更开
            const offsets = [-110, 0, 110]; 
            const rotations = [-12, 3, 10]; 
            const zIndexes = [1, 2, 1]; 
            
            return State.photos.map((src, i) => `
                <div class="cal-polaroid-v2" onclick="window.CalorieManager.uploadPhoto(${i})"
                     style="transform: translateX(${offsets[i]}px) rotate(${rotations[i]}deg); z-index:${zIndexes[i]};">
                    ${src ? `<img src="${src}">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#eee;font-size:24px;">+</div>'}
                </div>
            `).join('');
        },

        renderRecordList(list) {
        return list.map(r => `
            <div class="cal-record-item ${r.type==='inc'?'type-inc':'type-dec'}">
                <div class="cal-rec-icon">${r.type==='inc' ? Icons.food : Icons.run}</div>
                <div class="cal-rec-info">
                    <div class="cal-rec-name">${r.name}</div>
                    <div class="cal-rec-time">${new Date(r.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div class="cal-rec-val ${r.type==='inc'?'val-inc':'val-dec'}">
                    ${r.type==='inc'?'+':'-'}${r.value}
                </div>
            </div>
        `).join('');
    },

        // === 内部工具：上传 ===
        uploadAvatar() {
            this._triggerUpload((src) => {
                document.getElementById('cal-edit-avatar').src = src;
                State.tempAvatar = src;
            });
        },
        uploadPhoto(index) {
            this._triggerUpload(async (src) => {
                State.photos[index] = src;
                await window.dbActions.put('calorieSettings', { key: 'photos', value: State.photos });
                this.renderHome();
            });
        },
        _triggerUpload(cb) {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*';
            input.onchange = (e) => {
                const f = e.target.files[0];
                if(f) {
                    const r = new FileReader();
                    r.onload = (ev) => cb(ev.target.result);
                    r.readAsDataURL(f);
                }
            };
            input.click();
        },
        
        // === 核心修复：自定义通用弹窗 (解决点击无反应) ===
        createModal(title, bodyHtml, footerHtml = '') {
            // 先移除可能存在的旧弹窗
            const old = document.querySelector('.cal-app-modal-overlay');
            if (old) old.remove();

            const html = `
                <div class="cal-app-modal-overlay" id="cal-dynamic-modal">
                    <div class="cal-app-modal-card">
                        <div class="cal-modal-title">${title}</div>
                        <div class="cal-modal-body">${bodyHtml}</div>
                        <div class="cal-modal-footer" style="margin-top:20px;">
                            ${footerHtml}
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            
            // 点击遮罩层关闭
            document.getElementById('cal-dynamic-modal').addEventListener('click', (e) => {
                if(e.target.id === 'cal-dynamic-modal') e.target.remove();
            });
        },
        
        // 关闭弹窗的快捷函数
        closeModal() {
            const el = document.getElementById('cal-dynamic-modal');
            if(el) el.remove();
        },

        // === 4. 打开编辑弹窗 (含详细目标设置) ===
        async openEditor() {
            const profile = await window.dbActions.get('profile', 'userProfile') || {};
            const g = State.goals;

            const html = `
                <div class="cal-modal-overlay" id="cal-edit-modal">
                    <div class="cal-modal-card">
                        <h3 style="margin-top:0; margin-bottom:15px;">Settings</h3>
                        
                        <!-- 个人资料 -->
                        <div style="text-align:center; margin-bottom:20px;">
                            <img src="${profile.avatar||''}" id="cal-edit-avatar" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:1px solid #eee;" onclick="window.CalorieManager.uploadAvatar()">
                            <p style="font-size:10px; color:#999; margin-top:5px;">点击更换头像</p>
                        </div>
                        
                        <div style="display:flex; gap:10px;">
                            <div style="flex:1;">
                                <label class="cal-label-sm">Name</label>
                                <input type="text" id="cal-in-name" class="cal-input" value="${profile.name}">
                            </div>
                            <div style="flex:1;">
                                <label class="cal-label-sm">ID</label>
                                <input type="text" id="cal-in-id" class="cal-input" value="${profile.id}">
                            </div>
                        </div>

                        <div style="border-top:1px solid rgba(0,0,0,0.05); margin:15px 0;"></div>

                        <!-- 6. 详细目标设置 -->
                        <label class="cal-label-sm" style="color:var(--cal-text); font-weight:bold;">Goal Settings</label>
                        
                        <label class="cal-label-sm" style="margin-top:10px;">Plan Type</label>
                        <select id="cal-in-type" class="cal-input">
                            <option value="lose" ${g.type==='lose'?'selected':''}>减脂 (Reduce Cal)</option>
                            <option value="gain" ${g.type==='gain'?'selected':''}>增肌 (Gain Cal)</option>
                        </select>

                        <div style="display:flex; gap:10px;">
                            <div style="flex:1;">
                                <label class="cal-label-sm">Daily (Kcal)</label>
                                <input type="number" id="cal-in-daily" class="cal-input" value="${g.daily}">
                            </div>
                            <div style="flex:1;">
                                <label class="cal-label-sm">Total Plan</label>
                                <input type="number" id="cal-in-total" class="cal-input" value="${g.total}">
                            </div>
                        </div>

                        <button class="cal-btn" onclick="window.CalorieManager.saveEditor()">Save Changes</button>
                        <button class="cal-btn" style="background:transparent; color:#999; margin-top:0;" onclick="document.getElementById('cal-edit-modal').remove()">Cancel</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        // 保存逻辑
        async saveEditor() {
            // Profile
            const profile = await window.dbActions.get('profile', 'userProfile') || {};
            profile.name = document.getElementById('cal-in-name').value;
            profile.id = document.getElementById('cal-in-id').value;
            if(State.tempAvatar) profile.avatar = State.tempAvatar;
            await window.dbActions.set('profile', 'userProfile', profile);

            // Goals
            State.goals.type = document.getElementById('cal-in-type').value;
            State.goals.daily = Number(document.getElementById('cal-in-daily').value);
            State.goals.total = Number(document.getElementById('cal-in-total').value);

            await window.dbActions.put('calorieSettings', { key: 'goal_type', value: State.goals.type });
            await window.dbActions.put('calorieSettings', { key: 'goal_daily', value: State.goals.daily });
            await window.dbActions.put('calorieSettings', { key: 'goal_total', value: State.goals.total });

            document.getElementById('cal-edit-modal').remove();
            this.renderHome();
        }
    };

    // === 记账弹窗 (挂载到window) ===
    window.openCalRecordModal = () => {
        const bodyHtml = `
            <label class="cal-label-sm">Item Name</label>
            <input type="text" id="cal-direct-name" class="cal-input" placeholder="e.g. Apple">
            
            <label class="cal-label-sm">Type</label>
            <div style="display:flex;gap:10px;margin-bottom:15px;">
                <button class="cal-btn" style="background:#f0f0f0; color:#333; flex:1;" id="btn-type-dec" onclick="window.setRecType('dec')">消耗 (Burn)</button>
                <button class="cal-btn" style="background:#f0f0f0; color:#333; flex:1;" id="btn-type-inc" onclick="window.setRecType('inc')">摄入 (Intake)</button>
            </div>
            
            <label class="cal-label-sm">Calories</label>
            <input type="number" id="cal-direct-val" class="cal-input" placeholder="0">
        `;
        window.tempRecordType = 'inc'; // default
        
        // 使用 showModal (主程序的函数，需要确保这里能调到，或者我们自己实现一个简易的)
        // 为了保险，这里使用自己实现的遮罩层
        const html = `
            <div class="cal-modal-overlay" id="cal-record-modal">
                <div class="cal-modal-card">
                    <h3 style="margin-top:0;">Add Record</h3>
                    ${bodyHtml}
                    <button class="cal-btn" onclick="window.saveCalRecord()">Save</button>
                    <button class="cal-btn" style="background:transparent; color:#999; margin-top:0;" onclick="document.getElementById('cal-record-modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        window.setRecType('inc'); // init style
    };

    window.setRecType = (t) => {
        window.tempRecordType = t;
        const b1 = document.getElementById('btn-type-dec');
        const b2 = document.getElementById('btn-type-inc');
        // Reset
        b1.style.background = '#f0f0f0'; b1.style.color = '#333';
        b2.style.background = '#f0f0f0'; b2.style.color = '#333';
        // Active
        const activeBtn = t === 'dec' ? b1 : b2;
        activeBtn.style.background = 'var(--cal-text)';
        activeBtn.style.color = 'var(--cal-card)';
    };

    window.saveCalRecord = async () => {
        const name = document.getElementById('cal-direct-name').value;
        const val = document.getElementById('cal-direct-val').value;
        if(!name || !val) return;
        
        await window.dbActions.add('calorieRecords', { 
            timestamp: Date.now(), 
            name, 
            type: window.tempRecordType, 
            value: Number(val) 
        });
        
        document.getElementById('cal-record-modal').remove();
        // 刷新数据
        await window.CalorieManager.loadData();
        window.CalorieManager.renderHome();
    };
    
    
/* =======================================================
   核心数据库模块 (修复 V35.0 - 解决所有报错)
   ======================================================= */
window.dbActions = {
    dbName: 'PlatanusDB',
    version: 35, // 强制升级，修复表结构
    db: null,

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (e) => {
                console.error("DB Error:", e);
                resolve(null);
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                const allStores = [
                    'profile', 'diaries', 'notebooks', 'settings', 
                    'anniversaries', 'transactions', 
                    'snippets', 'snippetCollections',
                    'chatRoles', 'chatCategories', 'chatRooms', 
                    'chatRoomProfiles', 
                    'stickers', 'stickerCategories',
                    'calorieItems', 'calorieRecords', 'calorieSettings', 
                    'sleepRecords'
                ];

                allStores.forEach(name => {
                    if (!db.objectStoreNames.contains(name)) {
                        // 特殊表：键值对存储 (无 keyPath)
                        if (['profile', 'settings', 'calorieSettings'].includes(name)) {
                            db.createObjectStore(name); 
                        } else {
                            // 普通表：列表存储 (有 id)
                            db.createObjectStore(name, { keyPath: 'id' }); 
                        }
                    }
                });
            };
        });
    },

    // 核心检查：表真的存在吗？
    _has(storeName) {
        return this.db && this.db.objectStoreNames.contains(storeName);
    },

    get(storeName, key) {
        return new Promise((resolve) => {
            if (!this._has(storeName)) return resolve(null);
            try {
                const tx = this.db.transaction([storeName], 'readonly');
                const req = tx.objectStore(storeName).get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(null);
            } catch (e) { resolve(null); }
        });
    },

    getAll(storeName) {
        return new Promise((resolve) => {
            if (!this._has(storeName)) return resolve([]);
            try {
                const tx = this.db.transaction([storeName], 'readonly');
                const req = tx.objectStore(storeName).getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            } catch (e) { resolve([]); }
        });
    },

    // 写入 (自动判断是否需要 key)
    put(storeName, data, key) {
        return new Promise((resolve, reject) => {
            if (!this._has(storeName)) return resolve();
            try {
                const tx = this.db.transaction([storeName], 'readwrite');
                const store = tx.objectStore(storeName);
                // 如果传了 key，就用 key (针对 settings)；没传就只存 data (针对 diaries)
                const req = key ? store.put(data, key) : store.put(data);
                req.onsuccess = () => resolve(req.result);
                req.onerror = (e) => reject(e);
            } catch(e) { resolve(); }
        });
    },
    
    // 设置键值对专用
    set(storeName, key, value) { return this.put(storeName, value, key); },

    delete(storeName, key) {
        return new Promise((resolve) => {
            if (!this._has(storeName)) return resolve();
            try {
                const tx = this.db.transaction([storeName], 'readwrite');
                tx.objectStore(storeName).delete(key);
                tx.oncomplete = () => resolve();
            } catch(e) { resolve(); }
        });
    },

    clear(storeName) {
        return new Promise((resolve) => {
            if (!this._has(storeName)) return resolve();
            try {
                const tx = this.db.transaction([storeName], 'readwrite');
                tx.objectStore(storeName).clear();
                tx.oncomplete = () => resolve();
            } catch(e) { resolve(); }
        });
    }
};

/* =======================================================
   高级导入导出系统 (V12.0 - 终极修复版)
   ======================================================= */
window.AdvancedImporter = {
    
    // 所有表名清单
    storeList: [
        'profile', 'diaries', 'notebooks', 'settings', 'anniversaries', 
        'transactions', 'snippets', 'snippetCollections', 
        'chatRoles', 'chatCategories', 'chatRooms', 'chatRoomProfiles',
        'stickers', 'stickerCategories', 
        'calorieItems', 'calorieRecords', 'calorieSettings', 
        'sleepRecords'
    ],

    openExportMenu() {
        const html = `
            <div style="padding:10px;">
                <div class="io-option-group">
                    <span class="io-option-title">导出内容</span>
                    <label class="io-radio-label">
                        <input type="radio" name="exp-content" value="all" checked class="io-radio-input">
                        <span class="io-radio-text">全部数据 (含图片)</span>
                    </label>
                    <label class="io-radio-label">
                        <input type="radio" name="exp-content" value="text" class="io-radio-input">
                        <span class="io-radio-text">仅文字 (瘦身版)</span>
                    </label>
                </div>
                <div class="io-option-group">
                    <span class="io-option-title">文件格式</span>
                    <label class="io-radio-label">
                        <input type="radio" name="exp-format" value="zip" checked class="io-radio-input">
                        <span class="io-radio-text">ZIP 压缩包</span>
                    </label>
                    <label class="io-radio-label">
                        <input type="radio" name="exp-format" value="json" class="io-radio-input">
                        <span class="io-radio-text">JSON 原文件</span>
                    </label>
                </div>
            </div>
        `;
        
        const btnHtml = `<button class="cal-btn" style="background:var(--accent-color, #333);color:#fff;" onclick="window.AdvancedImporter.startExport()">开始导出</button>`;
        
        // 兼容各种弹窗调用方式
        if (window.CalorieManager && window.CalorieManager.createModal) {
            window.CalorieManager.createModal('高级导出', html, btnHtml);
        } else if (window.SleepManager && window.SleepManager.showModal) {
             window.SleepManager.showModal('高级导出', html, btnHtml);
        } else {
            // 兜底：如果模块未加载，尝试直接注入 HTML (针对极端情况)
            const modal = document.createElement('div');
            modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;justify-content:center;align-items:center;";
            modal.innerHTML = `<div style="background:#fff;padding:20px;border-radius:10px;width:80%;max-width:300px;"><h3>高级导出</h3>${html}<div style="margin-top:20px;text-align:right;">${btnHtml}<button style="margin-left:10px;" onclick="this.parentElement.parentElement.parentElement.remove()">关闭</button></div></div>`;
            document.body.appendChild(modal);
        }
    },

    async startExport() {
        if (typeof window.JSZip === 'undefined') { alert("JSZip 未加载，请刷新页面重试"); return; }
        
        const contentMode = document.querySelector('input[name="exp-content"]:checked').value;
        const formatMode = document.querySelector('input[name="exp-format"]:checked').value;
        
        // 更改按钮状态
        const btns = document.querySelectorAll('button');
        btns.forEach(b => { if(b.textContent.includes('导出')) { b.textContent = '打包中...'; b.disabled = true; } });

        try {
            const db = window.dbActions;
            const exportData = {};

            // 1. 遍历所有表导出
            for (const store of this.storeList) {
                // 【核心修复】检查表是否存在 (使用 _has 方法)
                if (!db._has(store)) continue;

                // 特殊处理单值/设置表
                if (store === 'profile') {
                    exportData[store] = await db.get(store, 'userProfile');
                } else if (store === 'settings' || store === 'calorieSettings') {
                    // 对于设置表，我们这里手动硬编码读取常见 Key，或者利用 index.html 里的 getAll
                    // 为了保险，我们尝试读取已知的 key
                    if (store === 'settings') {
                        exportData[store] = {
                            darkMode: await db.get(store, 'darkMode'),
                            language: await db.get(store, 'language'),
                            theme: await db.get(store, 'theme'),
                            font: await db.get(store, 'font'),
                            customCss: await db.get(store, 'customCss'),
                            showLunarCalendar: await db.get(store, 'showLunarCalendar'),
                            showHolidays: await db.get(store, 'showHolidays'),
                            fontPresets: await db.get(store, 'fontPresets'),
                            customDecos: await db.get(store, 'customDecos')
                        };
                    } else {
                        exportData[store] = {
                            goal_daily: await db.get(store, 'goal_daily'),
                            goal_total: await db.get(store, 'goal_total'),
                            goal_type: await db.get(store, 'goal_type'),
                            photos: await db.get(store, 'photos'),
                            calendar_colors: await db.get(store, 'calendar_colors')
                        };
                    }
                } else {
                    // 普通列表表
                    exportData[store] = await db.getAll(store);
                }
            }

            // 2. 剔除图片 (如果选了仅文字)
            if (contentMode === 'text') {
                this._cleanImages(exportData);
            }

            // 3. 生成文件
            const jsonStr = JSON.stringify(exportData);
            const fileName = `backup_${contentMode}_${new Date().toISOString().slice(0,10)}`;

            if (formatMode === 'zip') {
                const zip = new window.JSZip();
                zip.file("data.json", jsonStr);
                const blob = await zip.generateAsync({type:"blob"});
                this._download(blob, fileName + ".zip");
            } else {
                const blob = new Blob([jsonStr], { type: 'application/json' });
                this._download(blob, fileName + ".json");
            }

            this._closeModal();
            alert("导出成功！");

        } catch (e) {
            console.error(e);
            alert("导出出错：" + e.message);
            btns.forEach(b => { if(b.textContent.includes('打包中')) { b.textContent = '重试'; b.disabled = false; } });
        }
    },

    _cleanImages(data) {
        const walk = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            for (const key in obj) {
                if (['avatar', 'img', 'image', 'background', 'cover'].includes(key) && typeof obj[key] === 'string' && obj[key].length > 500) {
                    obj[key] = '';
                } else if (key === 'media' && Array.isArray(obj[key])) {
                    obj[key] = [];
                } else if (key === 'content' && typeof obj[key] === 'string' && obj[key].startsWith('data:image')) {
                    obj[key] = '[图片已移除]';
                } else {
                    walk(obj[key]);
                }
            }
        };
        walk(data);
    },

    triggerImport() {
        const html = `
            <div style="padding:20px; text-align:center;">
                <p style="margin-bottom:10px; font-weight:bold; color:var(--danger-color, #ff3b30);">⚠️ 警告</p>
                <p style="font-size:14px; opacity:0.8; line-height:1.5;">
                    导入将<b>完全覆盖</b>当前所有数据。<br>
                    请确保文件格式正确 (ZIP/JSON)。
                </p>
            </div>
        `;
        const btnHtml = `
            <button class="cal-btn" style="background:#eee;color:#333;" onclick="window.AdvancedImporter._closeModal()">取消</button>
            <button class="cal-btn" style="background:var(--danger-color, #ff3b30);color:#fff;" onclick="window.AdvancedImporter.selectFile()">选择文件</button>
        `;
        
        if (window.CalorieManager && window.CalorieManager.createModal) {
            window.CalorieManager.createModal('导入数据', html, btnHtml);
        } else if (window.SleepManager && window.SleepManager.showModal) {
             window.SleepManager.showModal('导入数据', html, btnHtml);
        }
    },

    selectFile() {
        this._closeModal();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip,.json';
        input.onchange = (e) => this._processFile(e.target.files[0]);
        input.click();
    },

    async _processFile(file) {
        if (!file) return;

        const mask = document.createElement('div');
        mask.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);color:white;z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
        mask.innerHTML = `<h2>数据恢复中...</h2><p>请勿关闭页面</p>`;
        document.body.appendChild(mask);

        try {
            let data = null;
            if (file.name.toLowerCase().endsWith('.zip')) {
                const zip = await window.JSZip.loadAsync(file);
                const jsonFile = Object.keys(zip.files).find(n => n.toLowerCase().endsWith('.json'));
                if (!jsonFile) throw new Error("ZIP 中找不到 .json 数据文件");
                const text = await zip.file(jsonFile).async("string");
                data = JSON.parse(text);
            } else {
                const text = await file.text();
                data = JSON.parse(text);
            }

            await this._restoreToDB(data);
            
            mask.remove();
            alert("导入成功！页面即将刷新...");
            location.reload();

        } catch (e) {
            mask.remove();
            alert("导入失败：" + e.message);
        }
    },

    async _restoreToDB(data) {
        const db = window.dbActions;
        
        // 1. 清空所有表
        for (const store of this.storeList) {
            await db.clear(store);
        }

        // 2. 写入数据
        for (const store of this.storeList) {
            if (!data[store]) continue;

            // 情况 A: Profile (单值)
            if (store === 'profile') {
                await db.safePut(store, data[store], 'userProfile');
            }
            // 情况 B: Settings (键值对)
            else if (store === 'settings' || store === 'calorieSettings') {
                const settingsObj = data[store];
                for (const key in settingsObj) {
                    if (settingsObj[key] !== undefined) {
                        // 【关键修复】使用 safePut 并传入 key
                        await db.safePut(store, settingsObj[key], key);
                    }
                }
            }
            // 情况 C: 列表数据 (日记等)
            else if (Array.isArray(data[store])) {
                for (const item of data[store]) {
                    // 自动修补 ID
                    if (!item.id) item.id = Date.now() + Math.floor(Math.random() * 9999);
                    // 【关键修复】列表数据只传 data，不传 key
                    await db.safePut(store, item); 
                }
            }
        }
    },

    _download(blob, filename) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },

    _closeModal() {
        if (window.CalorieManager) window.CalorieManager.closeModal();
        if (window.SleepManager) window.SleepManager.closeModal();
        const fallback = document.querySelector('[style*="z-index:9999"]');
        if (fallback) fallback.remove();
    }
};
    
    })();
    
/* =======================================================
   === 睡眠管理模块 V11.0 (逻辑最终修正版) ===
   ======================================================= */
(function() {
    
    // 图标库 (纯 SVG)
    const Icons = {
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
        chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>`,
        calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
        edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`
    };

    const State = {
        isSleeping: false,
        startTime: null,
        timerInterval: null,
        activeTab: 'home',
        records: [],
        isDeleteMode: false,
        tempLinkedDiaries: [] 
    };

    window.SleepManager = {
        
        async init() {
            // 1. 获取并激活容器
            const page = document.getElementById('sleep-page');
            if (!page) { alert("容器丢失"); return; }
            page.style.display = 'flex';
            page.classList.add('active');

            // 2. 隐藏主界面
            const topBar = document.getElementById('top-bar');
            const bottomNav = document.querySelector('.bottom-nav');
            if(topBar) topBar.style.display = 'none';
            if(bottomNav) bottomNav.style.display = 'none';

            // 3. 加载数据
            await this.loadData();
            this.checkActiveSleep();
            this.render();
        },

        exit() {
            const page = document.getElementById('sleep-page');
            if(page) {
                page.style.display = 'none';
                page.classList.remove('active');
            }
            if(State.timerInterval) clearInterval(State.timerInterval);
            
            // 恢复主页
            const topBar = document.getElementById('top-bar');
            const bottomNav = document.querySelector('.bottom-nav');
            if(topBar) topBar.style.display = ''; 
            if(bottomNav) bottomNav.style.display = 'flex';
            
            // 激活日记页
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('diary-page').classList.add('active');
            
            // 更新底部导航
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelector('.nav-item[data-page="diary-page"]')?.classList.add('active');
        },

        async loadData() {
            if (!window.dbActions) return;
            State.records = await window.dbActions.getAll('sleepRecords') || [];
            State.records.sort((a, b) => b.startTime - a.startTime); // 倒序
        },

        checkActiveSleep() {
            const savedStart = localStorage.getItem('sleep_start_time');
            if (savedStart) {
                State.isSleeping = true;
                State.startTime = parseInt(savedStart);
                this.startUITimer();
            } else {
                State.isSleeping = false;
                State.startTime = null;
            }
        },

        // === 核心渲染 ===
                // === 核心渲染 (修正版) ===
        render() {
            const container = document.getElementById('sleep-content-area');
            if (!container) return;
            
            // 清空容器
            container.innerHTML = '';
            
            // 样式设置
            container.style.flex = '1';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.overflow = 'hidden';
            container.style.width = '100%';

            // 头部导航栏样式
            const textColor = document.body.classList.contains('dark-mode') ? '#fff' : '#2c3e50';
            const commonHeader = `
                <div class="sleep-top-nav" style="color:${textColor}">
                    <div class="sleep-icon-btn" onclick="window.SleepManager.exit()">${Icons.back}</div>
                    <div style="font-size:16px; font-weight:bold; letter-spacing:1px;">SLEEP</div>
                    <div class="sleep-icon-btn" onclick="window.SleepManager.toggleDeleteMode()">${State.isDeleteMode ? Icons.check : Icons.trash}</div>
                </div>
            `;

            // === 1. 主页 (计时器 + 列表) ===
            if (State.activeTab === 'home') {
                this.renderHome(container);
            } 
            
            // === 2. 统计页 (图表 + 列表) ===
            else if (State.activeTab === 'stats') {
                // 构造 HTML 结构：头部 -> 统计图表容器 -> 滚动列表 -> 底部Dock
                container.innerHTML = `
                    ${commonHeader}
                    
                    <!-- 统计图表挂载点 -->
                    <div id="stats-tab-container" style="flex: 0 0 auto;"></div>
                    
                    <!-- 列表区域 -->
                    <div class="sleep-list-scroll" style="flex:1; overflow-y:auto;">
                        <div class="sleep-list-title">详细记录</div>
                        ${State.records.length === 0 ? 
                            '<div style="text-align:center;padding:20px;color:#888;">暂无记录</div>' : 
                            State.records.map(r => this.renderListItem(r)).join('')
                        }
                    </div>

                    ${this.renderDock()}
                `;

                // 关键：DOM生成后，立即初始化统计图表
                // 注意：这里传入 State.records，确保图表用的是最新数据
                setTimeout(() => {
                    SleepStatsModule.init('stats-tab-container', State.records);
                }, 0);
            } 
            
                        // === 3. 筛选页 (新功能) ===
            else {
                // 挂载一个新方法给 FilterModule 用来获取数据
                this.getAllRecords = () => State.records;

                container.innerHTML = `
                    ${commonHeader}
                    <!-- 筛选模块挂载点 -->
                    <div id="filter-tab-container" style="flex:1; overflow-y:auto;"></div>
                    ${this.renderDock()}
                `;
                
                // 异步初始化
                setTimeout(() => {
                    window.SleepFilterModule.init('filter-tab-container', State.records);
                }, 0);
            }
        },

        renderHome(container) {
            const isSleeping = State.isSleeping;
            const duration = isSleeping ? this.calculateDuration(State.startTime, Date.now()) : "00:00:00";
            const deleteIcon = State.isDeleteMode ? Icons.check : Icons.trash;
            const textColor = document.body.classList.contains('dark-mode') ? '#fff' : '#2c3e50';

            const html = `
                <div class="sleep-top-nav" style="color:${textColor}">
                    <div class="sleep-icon-btn" onclick="window.SleepManager.exit()">${Icons.back}</div>
                    <div style="font-size:16px; font-weight:bold; letter-spacing:1px;">SLEEP</div>
                    <div class="sleep-icon-btn" onclick="window.SleepManager.toggleDeleteMode()">${deleteIcon}</div>
                </div>

                <div class="sleep-stack-wrapper">
                    <div class="sleep-card layer-3"></div>
                    <div class="sleep-card layer-2"></div>
                    <div class="sleep-card layer-main">
                        <div class="sleep-hint-text">${isSleeping ? 'SLEEPING...' : 'Have a nice dream'}</div>
                        <div class="sleep-timer-text" id="sleep-timer-display">${duration}</div>
                        
                        <div class="sleep-btn-group">
                            ${!isSleeping ? `
                                <div class="sleep-circle-btn" onclick="window.SleepManager.openManualEntry()">
                                    <div class="sleep-circle-icon">${Icons.edit}</div>
                                    <span class="sleep-circle-label">手动</span>
                                </div>
                                <div class="sleep-circle-btn" onclick="window.SleepManager.startSleep()">
                                    <div class="sleep-circle-icon primary">${Icons.moon}</div>
                                    <span class="sleep-circle-label">开始</span>
                                </div>
                            ` : `
                                <div class="sleep-circle-btn" onclick="window.SleepManager.endSleep()">
                                    <div class="sleep-circle-icon primary">${Icons.sun}</div>
                                    <span class="sleep-circle-label">起床</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <div class="sleep-list-scroll ${State.isDeleteMode ? 'manage-mode' : ''}">
                    <div class="sleep-list-title">RECENT HISTORY</div>
                    ${State.records.length === 0 ? 
                        '<div style="text-align:center;padding:20px;color:#888;">暂无记录</div>' : 
                        State.records.map(r => this.renderListItem(r)).join('')
                    }
                </div>
                
                ${State.isDeleteMode ? `
    <div class="sleep-dock-wrapper">
         <!-- 关键修改：添加 pointer-events: auto; 否则点不到按钮 -->
         <div style="background:var(--sleep-card); padding:10px 20px; border-radius:30px; box-shadow:0 5px 20px rgba(0,0,0,0.1); display:flex; gap:10px; pointer-events: auto;">
             <button style="border:none; background:transparent; color:#666;" onclick="window.SleepManager.toggleDeleteMode()">取消</button>
             <button style="border:none; background:#ff4d4f; color:#fff; padding:5px 15px; border-radius:15px;" onclick="window.SleepManager.deleteSelected()">确认删除</button>
         </div>
    </div>
` : this.renderDock()}
            `;
            container.innerHTML = html;
        },

        renderListItem(r) {
            const dur = this.calculateDuration(r.startTime, r.endTime);
            const dateStr = new Date(r.startTime).toLocaleDateString();
            const timeRange = `${new Date(r.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} - ${new Date(r.endTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`;
            
            const qMap = { 'good': 'dot-good', 'fair': 'dot-fair', 'poor': 'dot-poor' };
            const qClass = qMap[r.quality] || 'dot-fair';
            const qName = { 'good':'优质', 'fair':'一般', 'poor':'较差' }[r.quality] || '一般';

            let diaryHtml = '';
            if (r.linkedDiaries && r.linkedDiaries.length > 0) {
                diaryHtml = `
                    <div class="sleep-linked-diary" onclick="window.SleepManager.showLinkedDiaries('${r.id}', event)">
                        ${Icons.file} 关联了 ${r.linkedDiaries.length} 篇日记
                    </div>
                `;
            }

            return `
                <div class="sleep-timeline-row">
                    <div class="sleep-timeline-line"></div>
                    <div class="sleep-timeline-dot ${qClass}"></div>
                    
                    <div class="sleep-item-card" ondblclick="window.SleepManager.editRecord(${r.id})">
                        <div class="sleep-check-box" data-id="${r.id}" onclick="window.SleepManager.toggleCheck(this, event)"></div>
                        <div style="width:100%">
                            <div class="sleep-card-row-1">
                                <span class="sleep-item-time">${timeRange}</span>
                                <span class="sleep-item-dur">${dur}</span>
                            </div>
                            <div class="sleep-card-row-2">
                                <span class="sleep-item-date">${dateStr}</span>
                                <span class="sleep-quality-tag">${qName}</span>
                            </div>
                            ${r.note ? `<div style="font-size:12px;color:var(--sleep-text-sub);margin-top:5px;">${r.note}</div>` : ''}
                            ${diaryHtml}
                        </div>
                    </div>
                </div>
            `;
        },

        renderDock() {
            const t = State.activeTab;
            const cls = (n) => `sleep-dock-item ${t===n?'active':''}`;
            return `
                <div class="sleep-dock-wrapper">
                    <div class="sleep-dock">
                        <div class="${cls('home')}" onclick="window.SleepManager.switchTab('home')">${Icons.list}</div>
                        <div class="${cls('stats')}" onclick="window.SleepManager.switchTab('stats')">${Icons.chart}</div>
                        <div class="${cls('calendar')}" onclick="window.SleepManager.switchTab('calendar')">${Icons.calendar}</div>
                    </div>
                </div>
            `;
        },

        switchTab(tab) { State.activeTab = tab; this.render(); },

        // === 计时 ===
        startSleep() {
            State.isSleeping = true;
            State.startTime = Date.now();
            localStorage.setItem('sleep_start_time', State.startTime);
            this.startUITimer();
            this.render();
        },

        endSleep() {
            const end = Date.now();
            const start = State.startTime;
            State.isSleeping = false;
            State.startTime = null;
            clearInterval(State.timerInterval);
            this.openSaveModal(start, end, false); 
        },

        openManualEntry() {
            const now = new Date();
            const start = new Date(now.getTime() - 8 * 3600000);
            this.openSaveModal(start.getTime(), now.getTime(), true);
        },

        async openSaveModal(startTs, endTs, isManual = false, editId = null) {
            const toISO = (ts) => new Date(ts - new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
            State.tempLinkedDiaries = [];
            
            if (editId) {
                const r = State.records.find(x => x.id === editId);
                if (r && r.linkedDiaries) State.tempLinkedDiaries = [...r.linkedDiaries];
            }

            const bodyHtml = `
                <div class="sleep-modal-content">
                    <label class="cal-label-sm">入睡时间</label>
                    <input type="datetime-local" id="sl-start" class="cal-input" value="${toISO(startTs)}">
                    
                    <label class="cal-label-sm" style="margin-top:10px;">醒来时间</label>
                    <input type="datetime-local" id="sl-end" class="cal-input" value="${toISO(endTs)}">
                    
                    <label class="cal-label-sm" style="margin-top:10px;">睡眠质量</label>
                    <div class="sleep-quality-selector">
                        <div class="sleep-quality-btn active" onclick="window.SleepManager.setQ(this, 'good')">优质</div>
                        <div class="sleep-quality-btn" onclick="window.SleepManager.setQ(this, 'fair')">一般</div>
                        <div class="sleep-quality-btn" onclick="window.SleepManager.setQ(this, 'poor')">较差</div>
                    </div>
                    <input type="hidden" id="sl-quality" value="good">

                    <label class="cal-label-sm">备注</label>
                    <input type="text" id="sl-note" class="cal-input" placeholder="熬夜、失眠...">

                    <div class="sleep-diary-selector-area">
                        <div class="sleep-diary-toggle">
                            <span>关联日记</span>
                            <label class="s-switch">
                                <input type="checkbox" id="sl-link-toggle" onchange="window.SleepManager.toggleDiarySelect(this)">
                                <span class="s-slider"></span>
                            </label>
                        </div>
                        <div id="sl-diary-list-box" class="sleep-diary-list">
                            <label class="cal-label-sm">选择日期</label>
                            <input type="date" id="sl-diary-date" class="cal-input" 
                                   value="${new Date(endTs).toISOString().slice(0,10)}" 
                                   onchange="window.SleepManager.loadDiaryCandidates(this.value)">
                            <div id="sl-candidate-list" style="margin-top:10px;"></div>
                        </div>
                    </div>
                </div>
            `;
            
            if(window.CalorieManager && window.CalorieManager.createModal) {
                // 这里的第二个参数 true/false 表示是否是结束计时保存
                const isTimerEnd = !isManual && !editId;
                window.CalorieManager.createModal(isManual?'补录睡眠':'记录睡眠', bodyHtml, 
    `<button class="cal-btn" onclick="window.SleepManager.saveDB(${editId || 'null'}, ${isTimerEnd})">保存记录</button>`
);
            }

            if (editId && State.tempLinkedDiaries.length > 0) {
                document.getElementById('sl-link-toggle').checked = true;
                window.SleepManager.toggleDiarySelect(document.getElementById('sl-link-toggle'));
            }
        },

        setQ(el, val) {
            document.querySelectorAll('.sleep-quality-btn').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('sl-quality').value = val;
        },

        toggleDiarySelect(el) {
            const box = document.getElementById('sl-diary-list-box');
            if (el.checked) {
                box.style.display = 'block';
                this.loadDiaryCandidates(document.getElementById('sl-diary-date').value);
            } else {
                box.style.display = 'none';
                State.tempLinkedDiaries = [];
            }
        },

        async loadDiaryCandidates(dateStr) {
            const listEl = document.getElementById('sl-candidate-list');
            listEl.innerHTML = '<div style="color:#999;font-size:12px;">加载中...</div>';
            
            const diaries = await window.dbActions.getAll('diaries');
            const target = new Date(dateStr).toDateString();
            const candidates = diaries.filter(d => new Date(d.timestamp).toDateString() === target);
            
            if (candidates.length === 0) {
                listEl.innerHTML = '<div style="color:#999;font-size:12px;">该日期无日记</div>';
                return;
            }

            listEl.innerHTML = candidates.map(d => {
                const isSelected = State.tempLinkedDiaries.includes(d.id);
                return `
                    <div class="sleep-diary-option ${isSelected?'selected':''}" onclick="window.SleepManager.selectCandidate(this, ${d.id})">
                        <div class="sleep-diary-option-check">${isSelected?'✓':''}</div>
                        <div class="sleep-diary-text">${d.content.substring(0, 30)}...</div>
                    </div>
                `;
            }).join('');
        },

        selectCandidate(el, id) {
            if (State.tempLinkedDiaries.includes(id)) {
                State.tempLinkedDiaries = State.tempLinkedDiaries.filter(d => d !== id);
                el.classList.remove('selected');
                el.querySelector('.sleep-diary-option-check').innerHTML = '';
            } else {
                State.tempLinkedDiaries.push(id);
                el.classList.add('selected');
                el.querySelector('.sleep-diary-option-check').innerHTML = '✓';
            }
        },

        // === 修复：保存逻辑 (处理短时间记录) ===
        // === 修复后的 saveDB 函数 ===
async saveDB(editId, isTimerEnd) {
    const startVal = document.getElementById('sl-start').value;
    const endVal = document.getElementById('sl-end').value;
    const quality = document.getElementById('sl-quality').value;
    const note = document.getElementById('sl-note').value;

    if (!startVal || !endVal) return alert('时间不能为空');
    
    let sTs = new Date(startVal).getTime();
    let eTs = new Date(endVal).getTime();

    // 修复 Bug：如果不满1分钟（因input忽略秒数导致时间相等或倒流）
    // 如果是计时结束模式，自动修正为 +1 分钟，保证能保存
    if (eTs <= sTs) {
        if (isTimerEnd) {
            eTs = sTs + 60000; // 强制增加1分钟
        } else {
            // 只有手动输入模式下才阻止保存
            return alert('醒来时间必须晚于入睡时间');
        }
    }

    // 关联日记
    const linkToggle = document.getElementById('sl-link-toggle');
    const linkedIds = (linkToggle && linkToggle.checked) ? State.tempLinkedDiaries : [];

    // 唯一 ID
    const newId = editId || (Date.now() + Math.floor(Math.random()*10000));
    
    const record = { 
        id: newId,
        startTime: sTs, endTime: eTs, 
        quality: quality, 
        note: note, 
        linkedDiaries: linkedIds
    };

    await window.dbActions.put('sleepRecords', record);
    
    // 只有在真的是计时结束时，才清除缓存
    if (isTimerEnd) localStorage.removeItem('sleep_start_time');

    this.closeModal();
    await this.loadData();
    this.render(); // 立即刷新列表
},
        
        

        startUITimer() {
            if (State.timerInterval) clearInterval(State.timerInterval);
            State.timerInterval = setInterval(() => {
                const el = document.getElementById('sleep-timer-display');
                if (el) el.textContent = this.calculateDuration(State.startTime, Date.now());
            }, 1000);
        },

        calculateDuration(s, e) {
            const d = e - s;
            const h = Math.floor(d / 3600000);
            const m = Math.floor((d % 3600000) / 60000);
            const sec = Math.floor((d % 60000) / 1000);
            return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}${State.isSleeping ? ':'+sec.toString().padStart(2,'0') : ''}`;
        },

        toggleDeleteMode() { State.isDeleteMode = !State.isDeleteMode; this.render(); },
        toggleCheck(el, e) { e.stopPropagation(); el.classList.toggle('checked'); },

        // === 修复：批量删除 (确保弹窗显示) ===
        deleteSelected() {
            const checked = document.querySelectorAll('.sleep-check-box.checked');
            if(checked.length === 0) {
                alert("请先勾选要删除的记录");
                return;
            }
            
            const count = checked.length;
            const html = `<div style="text-align:center;padding:20px;color:var(--sleep-text);">确定删除选中的 ${count} 条记录吗？<br><span style="font-size:12px;color:var(--sleep-text-sub);">此操作无法撤销</span></div>`;
            
            // 调用自己的 showModal
            this.showModal('确认删除', html, `
                <div style="display:flex;gap:15px;width:100%;">
                    <button class="sleep-quality-btn" onclick="window.SleepManager.closeModal()">取消</button>
                    <button class="sleep-quality-btn" style="background:#ff4d4f;color:white;border-color:#ff4d4f;" onclick="window.SleepManager.confirmDelete()">删除</button>
                </div>
            `);
        },

        async confirmDelete() {
            const checked = document.querySelectorAll('.sleep-check-box.checked');
            for(const c of checked) {
                await window.dbActions.delete('sleepRecords', Number(c.dataset.id));
            }
            State.isDeleteMode = false; // 退出删除模式
            this.closeModal();
            await this.loadData();
            this.render();
        },

        // === 独立 Modal 系统 (确保层级正确) ===
        showModal(title, body, footer) {
            const old = document.querySelector('.sleep-modal-wrapper');
            if(old) old.remove();

            // 注意这里的 class 包含 sleep-modal-wrapper (CSS里设置了极高层级)
            const html = `
                <div class="cal-app-modal-overlay sleep-modal-wrapper" id="sleep-modal-overlay">
                    <div class="cal-app-modal-card">
                        <div class="cal-modal-title">${title}</div>
                        <div class="cal-modal-body">${body}</div>
                        <div class="cal-modal-footer" style="margin-top:20px;">${footer}</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            // 绑定遮罩点击关闭
            setTimeout(() => {
                const overlay = document.getElementById('sleep-modal-overlay');
                if(overlay) {
                    overlay.onclick = (e) => {
                        if(e.target === overlay) this.closeModal();
                    };
                }
            }, 10);
        },

        closeModal() {
            const el = document.querySelector('.sleep-modal-wrapper');
            if(el) el.remove();
        },
        
        
        
        
        async editRecord(id) {
            if (State.isDeleteMode) return;
            const r = State.records.find(x => x.id === id);
            if(r) {
                await this.openSaveModal(r.startTime, r.endTime, true, r.id);
                setTimeout(() => {
                    document.getElementById('sl-note').value = r.note || '';
                    const btns = document.querySelectorAll('.sleep-quality-btn');
                    btns.forEach(b => b.classList.remove('active'));
                    const qMap = {'good':0, 'fair':1, 'poor':2};
                    if(btns[qMap[r.quality]]) btns[qMap[r.quality]].classList.add('active');
                    document.getElementById('sl-quality').value = r.quality;
                }, 100);
            }
        },

        async showLinkedDiaries(recordId, e) {
            e.stopPropagation();
            const r = State.records.find(x => x.id === parseInt(recordId));
            if(!r || !r.linkedDiaries || r.linkedDiaries.length === 0) return;

            let html = '<div style="max-height:300px;overflow-y:auto;">';
            for (const did of r.linkedDiaries) {
                const diary = await window.dbActions.get('diaries', did);
                if (diary) {
                    html += `
                        <div style="background:var(--sleep-bg); padding:10px; border-radius:10px; margin-bottom:10px;">
                            <div style="font-size:12px; color:var(--sleep-text-sub); margin-bottom:5px;">${new Date(diary.timestamp).toLocaleString()}</div>
                            <div style="font-size:14px; color:var(--sleep-text);">${diary.content}</div>
                        </div>
                    `;
                }
            }
            html += '</div>';
            window.CalorieManager.createModal('关联日记', html, `<button class="cal-btn" onclick="window.CalorieManager.closeModal()">关闭</button>`);
        }
    };

    document.addEventListener('click', function(e) {
        const item = e.target.closest('[data-page="sleep-page"]');
        if (item) {
            if (window.SleepManager) window.SleepManager.init();
        }
    });
    
/* =========================================
   新功能：睡眠统计模块 (V3 - 交互增强版)
   ========================================= */
/* =========================================
   新功能：睡眠统计模块 (V4 - 最终修复版)
   ========================================= */
// 注意：这里改成了 window.SleepStatsModule，修复点击无效的问题
window.SleepStatsModule = {
    config: {
        goalHours: 8, 
        chartColor: '#007AFF',
        ranges: [7, 30, 90, 365], 
        rangeLabels: ['Last 7 Days', 'Last 30 Days', 'Season (90d)', 'Year (365d)'],
        rangeTitles: ['近七日睡眠趋势', '近30日睡眠趋势', '季度睡眠趋势', '年度睡眠趋势'],
        currentRangeIndex: 0
    },

    currentRecords: [], 

    // 初始化
    init: function(containerId, records) {
        // 读取保存的目标
        const savedGoal = localStorage.getItem('sleep_goal_target');
        if (savedGoal) this.config.goalHours = parseFloat(savedGoal);

        this.currentRecords = records || [];
        
        const container = document.getElementById(containerId);
        if (!container) return;

        let statsWrapper = document.getElementById('sleep-stats-container');
        if (!statsWrapper) {
            statsWrapper = document.createElement('div');
            statsWrapper.id = 'sleep-stats-container';
            container.insertBefore(statsWrapper, container.firstChild);
        }
        
        // 渲染结构
        statsWrapper.innerHTML = `
            <div class="chart-wrapper">
                <div class="chart-header">
                    <span class="chart-title" id="chart-main-title">${this.config.rangeTitles[0]}</span>
                    <span class="chart-period-selector" id="chart-range-btn" onclick="window.SleepStatsModule.toggleRange()">
                        ${this.config.rangeLabels[0]}
                    </span>
                </div>
                <div style="position:relative; height: 160px; width: 100%;">
                    <svg id="sleep-trend-svg" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;"></svg>
                </div>
            </div>

            <div class="date-scroller" id="date-scroller"></div>

            <div class="sleep-summary-card" id="sleep-summary-card" ondblclick="window.SleepStatsModule.editGoal()">
                <div class="summary-left"><h3>请选择日期</h3></div>
            </div>
        `;

        const computedStyle = getComputedStyle(document.body);
        const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
        if(primaryColor) this.config.chartColor = primaryColor;

        this.refreshData();
    },

    // 切换范围
    toggleRange: function() {
        this.config.currentRangeIndex = (this.config.currentRangeIndex + 1) % this.config.ranges.length;
        const idx = this.config.currentRangeIndex;
        
        // 更新 UI
        document.getElementById('chart-range-btn').textContent = this.config.rangeLabels[idx];
        document.getElementById('chart-main-title').textContent = this.config.rangeTitles[idx];
        this.refreshData();
    },

    // 编辑目标
        // 1. 修改后的设置目标函数 (改用自定义弹窗)
    editGoal: function() {
        const html = `
            <div style="padding:15px 0;">
                <div style="margin-bottom:10px;color:var(--text-secondary);font-size:14px;text-align:center;">请输入每日睡眠目标 (小时)</div>
                <input type="number" id="stats-goal-input" value="${this.config.goalHours}" 
                       style="width:100%;height:50px;border-radius:15px;border:1px solid rgba(128,128,128,0.2);
                              background:rgba(128,128,128,0.1);color:var(--text-primary);
                              font-size:20px;font-weight:bold;text-align:center;outline:none;display:block;">
            </div>
        `;
        
        // 调用 SleepManager 现有的漂亮弹窗
        window.SleepManager.showModal('设置目标', html, `
            <div style="display:flex;gap:15px;width:100%;">
                <button class="sleep-quality-btn" onclick="window.SleepManager.closeModal()">取消</button>
                <button class="sleep-quality-btn" style="background:var(--primary-color);color:#fff;border:none;" onclick="window.SleepStatsModule.saveGoal()">保存</button>
            </div>
        `);
        
        // 自动聚焦输入框 (稍微延迟以等待动画)
        setTimeout(() => document.getElementById('stats-goal-input')?.focus(), 300);
    },

    // 2. 新增：保存目标逻辑
    saveGoal: function() {
        const input = document.getElementById('stats-goal-input');
        if(!input) return;
        const num = parseFloat(input.value);
        
        if (!isNaN(num) && num > 0 && num <= 24) {
            this.config.goalHours = num;
            localStorage.setItem('sleep_goal_target', num);
            
            // 刷新当前选中的卡片，更新未达标/达标状态
            const activeCap = document.querySelector('.date-capsule.active');
            if (activeCap) {
                activeCap.click(); // 重新触发点击来刷新
            } else {
                this.refreshData();
            }
            
            window.SleepManager.closeModal();
        } else {
            // 输入错误时的简单提示
            input.style.border = "1px solid #FF3B30";
            input.value = "";
            input.placeholder = "请输入 1-24";
        }
    },

    // 刷新数据
    refreshData: function() {
        const daysToShow = this.config.ranges[this.config.currentRangeIndex];
        const sleepData = this.processSleepData(this.currentRecords, daysToShow);
        this.renderChart(sleepData);
        this.renderDateScroller(sleepData);
        if (sleepData.length > 0) this.handleDateSelect(sleepData.length - 1, sleepData);
    },

    processSleepData: function(records, daysCount) {
        const days = [];
        const today = new Date();
        for (let i = daysCount - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const showWeekday = daysCount <= 14; 
            days.push({
                date: dateStr,
                displayDate: d.getDate(),
                displayDay: showWeekday ? ['日','一','二','三','四','五','六'][d.getDay()] : (d.getMonth()+1)+'月',
                hours: 0,
                quality: '无记录',
                raw: null
            });
        }
        records.forEach(r => {
            if (r.startTime && r.endTime) {
                const endDate = new Date(r.endTime).toISOString().split('T')[0];
                const targetDay = days.find(d => d.date === endDate);
                if (targetDay) {
                    const diffMs = r.endTime - r.startTime;
                    targetDay.hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1));
                    const qMap = { 'good': '优质', 'fair': '一般', 'poor': '较差' };
                    targetDay.quality = qMap[r.quality] || '一般';
                    targetDay.raw = r;
                }
            }
        });
        return days;
    },

    renderChart: function(data) {
        const svg = document.getElementById('sleep-trend-svg');
        if (!svg) return;
        
        const width = svg.getBoundingClientRect().width || 300;
        const height = 160;
        const padding = 15; // 改动：增加Padding，防止底部被切
        
        const maxVal = Math.max(10, ...data.map(d => d.hours));
        const getX = (i) => (i / (data.length - 1)) * (width - padding * 2) + padding;
        const getY = (v) => height - ((v / maxVal) * (height - padding * 2)) - padding;
        const points = data.map((d, i) => ({ x: getX(i), y: getY(d.hours) }));

        // 绘制曲线
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${this.config.chartColor};stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:${this.config.chartColor};stop-opacity:0" />
            </linearGradient>
        `;
        svg.innerHTML = '';
        svg.appendChild(defs);

        const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        areaPath.setAttribute("d", `${pathD} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`);
        areaPath.setAttribute("fill", "url(#chartGradient)");
        svg.appendChild(areaPath);

        const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        linePath.setAttribute("d", pathD);
        linePath.setAttribute("fill", "none");
        linePath.setAttribute("stroke", this.config.chartColor);
        linePath.setAttribute("stroke-width", "2.5");
        linePath.setAttribute("stroke-linecap", "round");
        svg.appendChild(linePath);

        if (data.length <= 30) {
            points.forEach((p, index) => {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", p.x);
                circle.setAttribute("cy", p.y);
                circle.setAttribute("r", "4");
                circle.setAttribute("fill", "#fff");
                circle.setAttribute("stroke", this.config.chartColor);
                circle.setAttribute("stroke-width", "2");
                circle.style.cursor = 'pointer';
                circle.onclick = () => {
                    window.SleepStatsModule.handleDateSelect(index, data); // 使用 window 调用
                    document.getElementById(`date-cap-${index}`)?.scrollIntoView({behavior:'smooth', inline:'center'});
                };
                svg.appendChild(circle);
            });
        }
    },

    renderDateScroller: function(data) {
        const scroller = document.getElementById('date-scroller');
        if (!scroller) return;
        scroller.innerHTML = '';
        data.forEach((d, index) => {
            const cap = document.createElement('div');
            cap.className = `date-capsule`;
            cap.id = `date-cap-${index}`;
            cap.innerHTML = `<span class="capsule-day">${d.displayDay}</span><span class="capsule-date">${d.displayDate}</span>`;
            cap.onclick = () => this.handleDateSelect(index, data);
            scroller.appendChild(cap);
        });
        setTimeout(() => { scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'auto' }); }, 50);
    },

    handleDateSelect: function(index, data) {
        document.querySelectorAll('.date-capsule').forEach(el => el.classList.remove('active'));
        const activeCap = document.getElementById(`date-cap-${index}`);
        if(activeCap) activeCap.classList.add('active');
        this.updateSummaryCard(data[index]);
    },

    updateSummaryCard: function(d) {
        const card = document.getElementById('sleep-summary-card');
        if (!card) return;
        const isHit = d.hours >= this.config.goalHours;
        let html = `
            <div class="summary-left">
                <h3>${d.date} 数据概览</h3>
                <div class="sleep-hours">${d.hours} <span style="font-size:14px;color:var(--text-secondary)">h</span></div>
                ${d.hours > 0 ? `<span class="sleep-quality-tag" style="background:rgba(0,122,255,0.1);color:#007AFF;font-size:10px;padding:2px 8px;">${d.quality}</span>` : ''}
            </div>
            <div class="summary-right">
                <div style="font-size:12px;opacity:0.8">目标: ${this.config.goalHours}h</div>
                <div class="goal-status ${isHit ? 'hit' : 'miss'}">${isHit ? '已达标 ✓' : '未达标'}</div>
                <!-- 改为：点击也能触发 -->
<div style="font-size:10px; opacity:0.5; margin-top:2px; font-weight:normal; padding:5px; margin:-5px; cursor:pointer;" onclick="window.SleepStatsModule.editGoal()">
    点击修改目标 >
</div>
        `;
        card.innerHTML = html;
    }
};

/* =========================================
   模块三：筛选与小组件 (Filter & Widget - 高定版)
   ========================================= */
window.SleepFilterModule = {
    state: {
        activeFilter: 'all', 
        widgetData: {
            title: 'My Lifestyle',
            desc: 'Tap to edit',
            img: null
        }
    },

    // 矢量图标库 (High-End SVG)
    icons: {
        all: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        hit: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        miss: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
        good: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        fair: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        poor: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
        note: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        link: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
        plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        list: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
    },
    
    // 初始化入口
    init: function(containerId, records) {
        const savedWidget = localStorage.getItem('sleep_music_widget');
        if(savedWidget) this.state.widgetData = JSON.parse(savedWidget);

        const container = document.getElementById(containerId);
        if(!container) return;

        container.innerHTML = `
            <div class="filter-page-container">
                <!-- 1. 分类按钮网格 -->
                <div class="filter-grid">
                    ${this.renderButtons()}
                </div>
                
                <!-- 2. 小组件 -->
                <div class="music-widget">
                    <div class="music-info">
                        <div class="music-title" onclick="window.SleepFilterModule.editTitle(true)">${this.state.widgetData.title}</div>
                        <div class="music-desc" onclick="window.SleepFilterModule.editTitle(false)">${this.state.widgetData.desc}</div>
                    </div>
                    <div class="music-cover-wrapper" onclick="document.getElementById('widget-file-input').click()">
                        ${this.state.widgetData.img ? 
                            `<img src="${this.state.widgetData.img}">` : 
                            `<span style="color:#fff; opacity:0.8;">${this.icons.plus}</span>`}
                    </div>
                    <input type="file" id="widget-file-input" style="display:none" accept="image/*" onchange="window.SleepFilterModule.handleImageUpload(this)">
                </div>

                <!-- 3. 结果列表标题 -->
                <div class="filter-result-header" id="filter-result-title">
                    ${this.icons.list} 全部记录
                </div>
                <!-- 4. 列表内容 -->
                <div id="filter-list-content"></div>
            </div>
        `;
        
        this.applyFilter(records);
    },

    // 渲染按钮
    renderButtons: function() {
        const filters = [
            {id:'all', label:'全部', icon: this.icons.all},
            {id:'hit', label:'已达标', icon: this.icons.hit},
            {id:'miss', label:'未达标', icon: this.icons.miss},
            {id:'good', label:'优质', icon: this.icons.good},
            {id:'fair', label:'一般', icon: this.icons.fair},
            {id:'poor', label:'较差', icon: this.icons.poor},
            {id:'note', label:'有备注', icon: this.icons.note},
            {id:'link', label:'关联日记', icon: this.icons.link}
        ];
        
        return filters.map(f => `
            <button class="filter-btn ${this.state.activeFilter === f.id ? 'active' : ''}" 
                    id="filter-btn-${f.id}"
                    onclick="window.SleepFilterModule.switchFilter('${f.id}')">
                <span class="filter-btn-icon">${f.icon}</span>
                ${f.label}
            </button>
        `).join('');
    },

    // 切换筛选
    switchFilter: function(id) {
        this.state.activeFilter = id;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`filter-btn-${id}`).classList.add('active');
        
        if(window.SleepManager && window.SleepManager.getAllRecords) {
             this.applyFilter(window.SleepManager.getAllRecords());
        }
    },
    
    // 执行筛选
    applyFilter: function(records) {
        const type = this.state.activeFilter;
        const goal = parseFloat(localStorage.getItem('sleep_goal_target') || 8);
        
        const filtered = records.filter(r => {
            const durHours = (r.endTime - r.startTime) / 3600000;
            switch(type) {
                case 'all': return true;
                case 'hit': return durHours >= goal;
                case 'miss': return durHours < goal;
                case 'good': return r.quality === 'good';
                case 'fair': return r.quality === 'fair';
                case 'poor': return r.quality === 'poor';
                case 'note': return r.note && r.note.trim().length > 0;
                case 'link': return r.linkedDiaries && r.linkedDiaries.length > 0;
                return true;
            }
        });

        const labelMap = {
            'all':'全部记录', 'hit':'已达标', 'miss':'未达标', 'good':'优质睡眠',
            'fair':'一般睡眠', 'poor':'较差睡眠', 'note':'有备注', 'link':'关联日记'
        };
        
        const listContainer = document.getElementById('filter-list-content');
        // 更新标题，使用 SVG 图标
        document.getElementById('filter-result-title').innerHTML = `
            ${this.icons.list} ${labelMap[type]} 
            <span style="opacity:0.5;margin-left:5px;font-weight:400;">(${filtered.length})</span>
        `;

        if(filtered.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center;padding:50px 0;color:#999;font-size:13px;">暂无相关记录</div>';
        } else {
            listContainer.innerHTML = filtered.map(r => window.SleepManager.renderListItem(r)).join('');
        }
    },

    // 编辑文字 (复用 SleepManager.showModal)
    editTitle: function(isMain) {
        const oldVal = isMain ? this.state.widgetData.title : this.state.widgetData.desc;
        const promptText = isMain ? "修改标题" : "修改副标题";
        
        const html = `
            <div style="padding:15px 0;">
                <input id="widget-edit-input" value="${oldVal}" 
                       style="width:100%;height:50px;border-radius:15px;border:1px solid rgba(128,128,128,0.2);
                              background:rgba(128,128,128,0.1);color:var(--text-primary);
                              font-size:16px;padding:0 15px;outline:none;">
            </div>
        `;
        
        window.SleepManager.showModal(promptText, html, `
            <div style="display:flex;gap:15px;width:100%;">
                <button class="sleep-quality-btn" onclick="window.SleepManager.closeModal()">取消</button>
                <button class="sleep-quality-btn" style="background:var(--primary-color);color:#fff;border:none;" onclick="window.SleepFilterModule.saveText(${isMain})">保存</button>
            </div>
        `);
        
        setTimeout(() => document.getElementById('widget-edit-input')?.focus(), 300);
    },

    saveText: function(isMain) {
        const val = document.getElementById('widget-edit-input').value;
        if(val) {
            if(isMain) this.state.widgetData.title = val;
            else this.state.widgetData.desc = val;
            this.saveWidget();
            const el = isMain ? document.querySelector('.music-title') : document.querySelector('.music-desc');
            if(el) el.textContent = val;
        }
        window.SleepManager.closeModal();
    },

    // 图片处理
    handleImageUpload: function(input) {
        if(input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.state.widgetData.img = e.target.result;
                    this.saveWidget();
                    const wrapper = document.querySelector('.music-cover-wrapper');
                    wrapper.innerHTML = `<img src="${e.target.result}">`;
                } catch (err) {
                    alert("图片过大，请压缩后上传");
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    saveWidget: function() {
        localStorage.setItem('sleep_music_widget', JSON.stringify(this.state.widgetData));
    }
};

})();

