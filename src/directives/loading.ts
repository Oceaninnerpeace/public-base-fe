import type { App, Directive, DirectiveBinding } from 'vue';

const CLASS_RELATIVE = 'app-loading-parent';

function getSpinning(binding: DirectiveBinding) {
  if (binding.value === undefined) return true;
  if (typeof binding.value === 'boolean') return binding.value;
  return !!binding.value?.spinning;
}

function getTip(binding: DirectiveBinding) {
  if (typeof binding.value === 'object' && binding.value?.tip) return binding.value.tip;
  return '加载中...';
}

const loadingDirective: Directive = {
  mounted(el, binding) {
    el.classList.add(CLASS_RELATIVE);
    el.setAttribute('data-loading', getSpinning(binding) ? '1' : '0');
    el.setAttribute('data-loading-tip', getTip(binding));
  },
  updated(el, binding) {
    el.setAttribute('data-loading', getSpinning(binding) ? '1' : '0');
    el.setAttribute('data-loading-tip', getTip(binding));
  },
};

export function setupLoadingDirective(app: App) {
  if (!document.getElementById('app-loading-style')) {
    const style = document.createElement('style');
    style.id = 'app-loading-style';
    style.textContent = `.${CLASS_RELATIVE} { position: relative !important; }`;
    document.head.append(style);
  }
  app.directive('loading', loadingDirective);
}
