var expertModeCheckbox;
var modeSwitchingComponents;

var button;

$(document).ready(function () {
    const applyExpertMode = (comps = [], switchState = "none") => {
        let length = comps.length;
        for (let i = 0; i < length; i++) {
            comps[i].style.display = switchState;
        }
    };

    SCWeb.core.ExpertModeEnabled = false;
    expertModeCheckbox = document.querySelector('#mode-switching-checkbox');
    modeSwitchingComponents = document.getElementsByClassName("mode-switching-panel");

    if (expertModeCheckbox) {
      expertModeCheckbox.checked = SCWeb.core.ExpertModeEnabled;
      if (!expertModeCheckbox.checked) {
         applyExpertMode(modeSwitchingComponents)
      }
      expertModeCheckbox.onclick = function () {
         applyExpertMode(modeSwitchingComponents, expertModeCheckbox.checked ? "" : "none")
         SCWeb.core.ExpertModeEnabled = expertModeCheckbox.checked;
         SCWeb.core.EventManager.emit("expert_mode_changed");
      };
   }
});
