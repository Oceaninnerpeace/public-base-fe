/** Qiankun 子应用挂载点，须与 portal-apps / MicroAppView 一致 */
export const MICRO_CONTAINER_ID = 'micro-app-container';

export const MICRO_CONTAINER_SELECTOR = `#${MICRO_CONTAINER_ID}`;

/** 等待挂载容器出现在 DOM（Qiankun 加载子应用前调用） */
export function waitForMicroContainer(maxMs = 8000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + maxMs;

    const tick = () => {
      const el = document.getElementById(MICRO_CONTAINER_ID);
      if (el) {
        resolve(el);
        return;
      }
      if (Date.now() > deadline) {
        reject(
          new Error(
            `[portal] Target container ${MICRO_CONTAINER_SELECTOR} not found within ${maxMs}ms`,
          ),
        );
        return;
      }
      requestAnimationFrame(tick);
    };

    tick();
  });
}
