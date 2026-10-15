const menuButton = document.querySelector("[data-menu-toggle]");
const sidebar = document.querySelector(".sidebar");
function closeMenu() {
  sidebar?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}
menuButton?.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (
    sidebar?.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menuButton.contains(event.target)
  )
    closeMenu();
});
sidebar
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document
  .querySelector("[data-print]")
  ?.addEventListener("click", () => window.print());

const demo = document.querySelector("[data-parking-demo]");
if (demo) {
  const scenarios = {
    normal: [
      {
        text: "입구에서 차량을 감지하고 서버에 입차 요청 코드 1을 보냅니다.",
        slots: ["empty", "empty", "empty"],
      },
      {
        text: "서버의 코드 102로 P2를 배정합니다. P2 안내 LED와 입구 차단기를 켭니다.",
        slots: ["empty", "assigned", "empty"],
      },
      {
        text: "P2 입력이 EMPTY → OCCUPIED로 바뀝니다. 점유 코드 12와 정상 주차 코드 32를 보냅니다.",
        slots: ["empty", "occupied", "empty"],
      },
      {
        text: "P2 안내 LED를 끄고 입구 차단기를 닫습니다.",
        slots: ["empty", "occupied", "empty"],
      },
    ],
    wrong: [
      {
        text: "P2를 배정받은 상태입니다. P2 안내 LED가 켜집니다.",
        slots: ["empty", "assigned", "empty"],
      },
      {
        text: "차량이 다른 주차면 P3에 들어갑니다. 오주차 코드 43을 보냅니다.",
        slots: ["empty", "assigned", "wrong"],
      },
      {
        text: "차량이 P3에서 나가면 오주차 해제 코드 53을 보냅니다.",
        slots: ["empty", "empty", "empty"],
      },
      {
        text: "원래 배정된 P2의 안내 LED를 다시 켜서 안내합니다.",
        slots: ["empty", "assigned", "empty"],
      },
    ],
    exit: [
      {
        text: "차량이 P2에서 빠져나가면 주차면 비움 코드 22를 보냅니다.",
        slots: ["empty", "empty", "empty"],
      },
      {
        text: "출구 센서가 차량을 감지하면 출차 요청 코드 2를 보냅니다.",
        slots: ["empty", "empty", "empty"],
      },
      {
        text: "서버의 출차 승인 코드 110을 받으면 출구 차단기를 엽니다.",
        slots: ["empty", "empty", "empty"],
      },
      {
        text: "출구 센서의 감지가 해제되면 차단기를 닫고 출차 완료 코드 60을 보냅니다.",
        slots: ["empty", "empty", "empty"],
      },
    ],
  };
  let selected = "normal";
  let step = 0;
  const labels = {
    empty: "비어 있음",
    assigned: "배정 · 안내",
    occupied: "정상 주차",
    wrong: "오주차",
  };
  const render = () => {
    const state = scenarios[selected][step];
    demo.querySelector("[data-demo-message]").textContent = state.text;
    demo.querySelector("[data-step-label]").textContent = `STEP 0${step + 1}`;
    demo.querySelector("[data-step-count]").textContent =
      `${step + 1} / ${scenarios[selected].length}`;
    demo.querySelectorAll("[data-slot]").forEach((slot, index) => {
      slot.className = `slot ${state.slots[index]}`;
      slot.querySelector("span").textContent = labels[state.slots[index]];
    });
    demo.querySelector("[data-prev]").disabled = step === 0;
    demo.querySelector("[data-next]").disabled =
      step === scenarios[selected].length - 1;
    demo
      .querySelectorAll("[data-scenario]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.scenario === selected),
        ),
      );
  };
  demo.querySelectorAll("[data-scenario]").forEach((button) =>
    button.addEventListener("click", () => {
      selected = button.dataset.scenario;
      step = 0;
      render();
    }),
  );
  demo.querySelector("[data-prev]").addEventListener("click", () => {
    if (step > 0) step--;
    render();
  });
  demo.querySelector("[data-next]").addEventListener("click", () => {
    if (step < scenarios[selected].length - 1) step++;
    render();
  });
  render();
}
