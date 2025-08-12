'use strict';

// Sunoのコメント入力欄に誤送信防止機能を追加する関数
const addEnterFixListener = (targetNode) => {
    // コメント入力欄と思われる要素を探す
    const textareas = targetNode.querySelectorAll('textarea, [role="textbox"]');

    textareas.forEach(textarea => {
        // 既に処理済みの場合は何もしない
        if (textarea.dataset.enterFixApplied) {
            return;
        }

        // キーが押された時のイベントを監視
        textarea.addEventListener('keydown', (event) => {
            // 日本語入力の変換中（isComposingがtrue）にEnterキーが押された場合
            if (event.key === 'Enter' && event.isComposing) {
                // 本来の送信動作（イベントの伝播）をここで止める
                event.stopImmediatePropagation();
            }
        }, true); // trueにすることで、他のどのイベントよりも先にこの処理を実行する

        // 処理済みのマークを付けて、二重に処理しないようにする
        textarea.dataset.enterFixApplied = 'true';
    });
};

// ページの要素が動的に変わることを想定し、変更を監視する
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                // 追加されたノードが要素ノードの場合のみ処理
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addEnterFixListener(node);
                }
            });
        }
    }
});

// 監視を開始
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// ページ読み込み完了時にも一度実行
addEnterFixListener(document.body);