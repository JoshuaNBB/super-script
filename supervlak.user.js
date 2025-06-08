// ==UserScript==
// @name         SUPER VLAK 2
// @namespace    https://divokekmeny.cz/
// @version      4.0
// @description  Vlak s režimem BARBARKA: 25 LC + 1 šlechtic nebo plný útok pro hráče. Podpora režimu 1 šlechtic. © J.o.s.h.u.a 2025
// @author       J.o.s.h.u.a
// @match        https://*/game.php?*screen=place*
// @match        https://*/game.php?village=*&screen=map*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "vlakPocetSlechticu";
    const TYPE_KEY = "vlakTypCile";
    const FLAG_RUNNING = "vlakSpusteno";
    const isConfirmPage = window.location.href.includes("try=confirm");

    if (isConfirmPage) {
        if (localStorage.getItem(FLAG_RUNNING) === "true") confirmPageScript();
        return;
    }

    const observer = new MutationObserver(() => {
        const popup = document.querySelector("#popup_box_popup_command");
        if (popup && popup.querySelector("#command_target") && !popup.querySelector("#super_vlak_wrapper")) {
            vlozTlacitka(popup.querySelector("#command_target"));
        }

        const classic = document.querySelector("#command_actions");
        if (classic && !document.querySelector("#super_vlak_wrapper")) {
            vlozTlacitka(classic);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function vlozTlacitka(actionsDiv) {
        const wrapper = document.createElement("div");
        wrapper.id = "super_vlak_wrapper";
        wrapper.style.marginTop = "8px";
        wrapper.style.paddingTop = "6px";
        wrapper.style.borderTop = "1px solid #c1a264";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";

        const startBtn = document.createElement("button");
        startBtn.className = "btn";
        startBtn.textContent = "🚀 SPUSTIT VLAK";
        startBtn.addEventListener("click", () => {
            startBtn.disabled = true;
            startBtn.textContent = "⏳ Probíhá...";
            localStorage.setItem(FLAG_RUNNING, "true");
            spustitZaklad();
        });

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "btn";
        toggleBtn.textContent = "⚙️ POČET";

        const chooser = document.createElement("div");
        chooser.style.position = "fixed";
        chooser.style.background = "#fff";
        chooser.style.border = "1px solid #ccc";
        chooser.style.padding = "6px 10px";
        chooser.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        chooser.style.display = "none";
        chooser.style.zIndex = "99999";

        const moznosti = ["1", "2", "3", "4"];
        const selectedValue = localStorage.getItem(STORAGE_KEY) || "4";

        moznosti.forEach(value => {
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.value = value;
            cb.checked = value === selectedValue;

            cb.addEventListener("change", () => {
                chooser.querySelectorAll("input").forEach(el => el.checked = false);
                cb.checked = true;
                localStorage.setItem(STORAGE_KEY, cb.value);
            });

            const label = document.createElement("div");
            label.appendChild(cb);
            label.append(` ${value} šlechtic(i)`);
            chooser.appendChild(label);
        });

        toggleBtn.addEventListener("click", () => {
            chooser.style.display = chooser.style.display === "none" ? "block" : "none";
            const rect = toggleBtn.getBoundingClientRect();
            chooser.style.top = `${rect.bottom + 5}px`;
            chooser.style.left = `${rect.left}px`;
        });

        const typeBtn = document.createElement("button");
        typeBtn.className = "btn";
        typeBtn.textContent = "⚙️ TYP CÍLE";

        const typeChooser = document.createElement("div");
        typeChooser.style.position = "fixed";
        typeChooser.style.background = "#fff";
        typeChooser.style.border = "1px solid #ccc";
        typeChooser.style.padding = "6px 10px";
        typeChooser.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        typeChooser.style.display = "none";
        typeChooser.style.zIndex = "99999";

        const typy = [
            { value: "hrac", label: "HRÁČ" },
            { value: "barbarka", label: "BARBARKA" }
        ];

        const selectedTyp = localStorage.getItem(TYPE_KEY) || "hrac";

        typy.forEach(opt => {
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.value = opt.value;
            cb.checked = opt.value === selectedTyp;

            cb.addEventListener("change", () => {
                typeChooser.querySelectorAll("input").forEach(el => el.checked = false);
                cb.checked = true;
                localStorage.setItem(TYPE_KEY, cb.value);
                aktualizujZvyrazneni(typeBtn);
            });

            const label = document.createElement("div");
            label.appendChild(cb);
            label.append(` ${opt.label}`);
            typeChooser.appendChild(label);
        });

        typeBtn.addEventListener("click", () => {
            typeChooser.style.display = typeChooser.style.display === "none" ? "block" : "none";
            const rect = typeBtn.getBoundingClientRect();
            typeChooser.style.top = `${rect.bottom + 5}px`;
            typeChooser.style.left = `${rect.left}px`;
        });

        function aktualizujZvyrazneni(button) {
            const typ = localStorage.getItem(TYPE_KEY);
            button.style.backgroundColor = typ === "barbarka" ? "#c1ffc1" : "#fff";
        }

        aktualizujZvyrazneni(typeBtn);

        const podpis = document.createElement("span");
        podpis.textContent = "© 2025 J.o.s.h.u.a";
        podpis.style.fontSize = "10px";
        podpis.style.color = "#999";
        podpis.style.marginLeft = "auto";

        wrapper.appendChild(startBtn);
        wrapper.appendChild(toggleBtn);
        wrapper.appendChild(typeBtn);
        wrapper.appendChild(podpis);
        actionsDiv.appendChild(wrapper);
        document.body.appendChild(chooser);
        document.body.appendChild(typeChooser);
    }

    function spustitZaklad() {
        const typ = localStorage.getItem(TYPE_KEY) || "hrac";
        const pocet = parseInt(localStorage.getItem(STORAGE_KEY) || "4");

        if (typ === "barbarka") {
            document.getElementById("unit_input_light").value = 25;
            document.getElementById("unit_input_snob").value = 1;
        } else {
            const jednotky = {
                axe: "unit_input_axe",
                light: "unit_input_light",
                ram: "unit_input_ram",
                snob: "unit_input_snob"
            };

            const axe = document.getElementById(jednotky.axe);
            const axeCount = parseInt(axe?.dataset.allCount || "0");
            if (axeCount > 0) axe.value = axeCount;

            const light = document.getElementById(jednotky.light);
            const lightCount = parseInt(light?.dataset.allCount || "0");
            const sendLight = Math.max(0, lightCount - 300);
            if (sendLight > 0) light.value = sendLight;

            const ram = document.getElementById(jednotky.ram);
            const ramCount = parseInt(ram?.dataset.allCount || "0");
            if (ramCount > 0) ram.value = ramCount;

            const snob = document.getElementById(jednotky.snob);
            const snobCount = parseInt(snob?.dataset.allCount || "0");
            if (snobCount > 0) snob.value = 1;
        }

        // Režim "1 šlechtic"
        if (pocet === 1) {
            setTimeout(() => {
                const attackBtn = document.getElementById("target_attack");
                if (attackBtn) attackBtn.click();
                // potvrzení se provede v confirmPageScript
            }, 300);
            return;
        }

        // Režimy 2+ šlechtici
        setTimeout(() => {
            const attackBtn = document.getElementById("target_attack");
            if (!attackBtn) {
                alert("Tlačítko Útok nebylo nalezeno.");
                localStorage.removeItem(FLAG_RUNNING);
                return;
            }

            attackBtn.click();

            let clickCount = 0;
            const maxClicks = pocet - 1;
            const maxAttackIndex = pocet;

            function clickNextAdd() {
                const addBtn = document.querySelector("#troop_confirm_train.place-confirm-new-attack");
                if (addBtn) {
                    addBtn.click();
                    clickCount++;
                    if (clickCount < maxClicks) {
                        setTimeout(clickNextAdd, 150);
                    } else {
                        setTimeout(() => {
                            doplnitUtoky(2, maxAttackIndex, typ);
                            setTimeout(() => {
                                const submitBtn = document.getElementById("troop_confirm_submit");
                                if (submitBtn) submitBtn.click();
                                localStorage.removeItem(FLAG_RUNNING);
                            }, 200);
                        }, 150);
                    }
                } else {
                    setTimeout(clickNextAdd, 250);
                }
            }

            setTimeout(clickNextAdd, 500);
        }, 200);
    }

    function doplnitUtoky(from, to, typ) {
        for (let i = from; i <= to; i++) {
            const jednotky = ["spear", "sword", "axe", "archer", "spy", "light", "heavy", "ram", "catapult", "knight", "snob"];
            jednotky.forEach(j => {
                const input = document.querySelector(`input[name="train[${i}][${j}]"]`);
                if (input) input.value = "";
            });

            if (typ === "barbarka") {
                const light = document.querySelector(`input[name="train[${i}][light]"]`);
                const snob = document.querySelector(`input[name="train[${i}][snob]"]`);
                if (light) light.value = 25;
                if (snob) snob.value = 1;
            } else {
                const light = document.querySelector(`input[name="train[${i}][light]"]`);
                const snob = document.querySelector(`input[name="train[${i}][snob]"]`);
                if (light) light.value = 100;
                if (snob) snob.value = 1;
            }
        }
    }

    function confirmPageScript() {
        const typ = localStorage.getItem(TYPE_KEY) || "hrac";
        const pocet = parseInt(localStorage.getItem(STORAGE_KEY) || "4");

        if (pocet === 1) {
            const submitBtn = document.getElementById("troop_confirm_submit");
            if (submitBtn) submitBtn.click();
            localStorage.removeItem(FLAG_RUNNING);
            return;
        }

        let clickCount = 0;
        const maxClicks = pocet - 1;
        const maxAttackIndex = pocet;

        function clickNextAdd() {
            const addBtn = document.getElementById("troop_confirm_train");
            if (addBtn) {
                addBtn.click();
                clickCount++;
                if (clickCount < maxClicks) {
                    setTimeout(clickNextAdd, 100);
                } else {
                    setTimeout(() => {
                        doplnitUtoky(2, maxAttackIndex, typ);
                        setTimeout(() => {
                            const submitBtn = document.getElementById("troop_confirm_submit");
                            if (submitBtn) submitBtn.click();
                            localStorage.removeItem(FLAG_RUNNING);
                        }, 200);
                    }, 100);
                }
            } else {
                localStorage.removeItem(FLAG_RUNNING);
            }
        }

        setTimeout(clickNextAdd, 300);
    }
})();
