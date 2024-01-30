const txtExtracted = document.getElementById("txtExtracted");
function extract() {
  const txtCss = document.getElementById("txtCss").value;
  const txtHTML = document.getElementById("txtHTML").value;
  const div = document.createElement("div");

  div.innerHTML = txtHTML;

  const allElements = div.querySelectorAll("*");
  const allClasses = Array.from(allElements).reduce((classes, element) => {
    classes.push(...element.classList);
    return classes;
  }, []);

  const uniqueClasses = Array.from(new Set(allClasses));

  txtExtracted.innerText = extractCSSRules(uniqueClasses, txtCss);
}

function extractCSSRules(classes, css) {
  const rules = css.match(/[^{]+\{[^}]*\}/g) || [];
  const classRules = new Map();

  classes.forEach((className) => {
    classRules.set(className, {});
  });

  rules.forEach((rule) => {
    classes.forEach((className) => {
      const classRegex = new RegExp(`\\.${className}(\\s|,|\\{)`);
      if (rule.match(classRegex)) {
        const properties = rule
          .substring(rule.indexOf("{") + 1, rule.lastIndexOf("}"))
          .trim()
          .split(";")
          .reduce((acc, prop) => {
            const [key, value] = prop.split(":").map((p) => p.trim());
            if (key && value) acc[key] = value;
            return acc;
          }, {});

        const existingProperties = classRules.get(className);
        Object.assign(existingProperties, properties);
        classRules.set(className, existingProperties);
      }
    });
  });

  const extractedRules = [];
  classRules.forEach((properties, className) => {
    const propsString = Object.entries(properties)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
    extractedRules.push(`.${className} { ${propsString} }`);
  });

  return extractedRules.join("\n");
}

const btnExtract = document.getElementById("btnExtract");
btnExtract.addEventListener("click", () => {
  extract();
});

btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(txtExtracted.value);
});
