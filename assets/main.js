;(function(){
    $(document).ready(() => {
        let activeSwitcherModifier = 'order-history__tab-item--active',
            activeContentModifier = 'order-history__tab-content--shown';

        let $container = $('.js-tabs-container'),
            $tabContents = $('.js-tab-container'),
            $tabSelect = $('#tab');

        function tabSwitcher(data, $element){
            if ($element === undefined){
                $element = $container.find(`[data-tab='${data}']`);
            }

            let $activeContent = $container.find('.' + activeContentModifier);

            if(data === undefined || $activeContent.data('tab-content') === data) return;

            $activeContent.removeClass(activeContentModifier);

            $container.find('.' + activeSwitcherModifier).removeClass(activeSwitcherModifier);
            $element.closest('.order-history__tab-item').addClass(activeSwitcherModifier);
            $tabSelect.val(data);

            for (let tab of $tabContents){
                let $tab = $(tab);
                let tabData = $tab.data('tab-content');
                if(data === tabData){
                    $tab.addClass(activeContentModifier);
                    break;
                }
            }
        }

        $container.on('click', '.js-tab-switcher', (e) => {
            e.preventDefault();
            let $element = $(e.target);
            let data = $element.data('tab');

            tabSwitcher(data, $element);
        });

        $tabSelect.on('change', (e)=>{
            let data = $(e.target).val();

            tabSwitcher(data);
        });
    });
})();
;(function () {
    $(document).ready(() => {
        let $container = $('.js-tabs-container');
        let $tabs = $('.js-tab-container');
        let textHiddenModifier = 'text--hidden';

        function filter($tabContainer, $filterContainer, $elements){
            let months = $filterContainer.find('#months').val(),
                office = $filterContainer.find('#office').val(),
                filterProperties = [months, office];

            for(let index in filterProperties){
                if(filterProperties[index] === undefined) filterProperties[index] = '';
            }

            $elements = $elements.hide().filter((index, element) => {
                return $(element).data('element').every((element, index) => {

                    if (index === 0) {
                        filterProperties[index] = parseInt(filterProperties[index]);
                        return !filterProperties[index] || filterProperties[index] >= element;
                    } else {
                        return !filterProperties[index] || filterProperties[index] === element;
                    }
                })
            }).show();

            let count = $elements.length;

            if(count === 0){
                $tabContainer.find('.js-filter-found').addClass(textHiddenModifier);
                $tabContainer.find('.js-filter-empty').removeClass(textHiddenModifier);
            } else{
                $tabContainer.find('.js-filter-found').removeClass(textHiddenModifier);
                $tabContainer.find('.js-filter-empty').addClass(textHiddenModifier);
            }

            $tabContainer.find('.js-order-count').text(count);
        }

        $tabs.each(function(){
            let $tabContainer = $(this),
                $filterContainer = $tabContainer.find('.js-filters'),
                $elements = $tabContainer.find('[data-element]');

            filter($tabContainer, $filterContainer, $elements);
        });

        $container.on('change', '.js-order-filter', (e) => {
            let $filterContainer = $(e.target).closest('.js-filters'),
                $tabContainer = $(e.target).closest('.js-tab-container'),
                $elements = $tabContainer.find('[data-element]');

            filter($tabContainer, $filterContainer, $elements);
        });
    });
})();
;(function(){
    let $body = $('body');
    $body.on('click', '.identixweb_advance_reorder', (e)=>{
        bodyScrollLock.disableBodyScroll(e.target);
    });

    $body.on('click', '.advance_reorder_popup_account_close', ()=>{
        bodyScrollLock.clearAllBodyScrollLocks();
    })
})();