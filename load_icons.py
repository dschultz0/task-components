import shutil
from collections import defaultdict
import json

bp_assets_path = "node_modules/@blueprintjs/icons/src/generated"
bp_css_path = "node_modules/@blueprintjs/core/lib/css/blueprint.css"
assets_path = "src/assets"
icon_list_path = "src/components/task-icon/icons.txt"
icons_path = "src/components/task-icon/icons.ts"
css_path = "src/components/task-icon/task-icon-chars.css"

# Capture fonts we want to use
font16 = ["blueprint-icons-16.woff2"]
font20 = ["blueprint-icons-20.woff2"]
for f in font16:
    shutil.copyfile(f"{bp_assets_path}/16px/{f}", f"{assets_path}/{f}")
for f in font20:
    shutil.copyfile(f"{bp_assets_path}/20px/{f}", f"{assets_path}/{f}")

# Build the icons file with svg markers for included icons
with open(icon_list_path) as fp:
    included_icons = [line.strip() for line in fp.readlines()]
paths = defaultdict(dict)
for icon in included_icons:
    for size in ["16", "20"]:
        with open(f"{bp_assets_path}/{size}px/paths/{icon}.ts") as fp:
            line = fp.readline().strip()
            if line.startswith("export default"):
                paths[icon][int(size)] = line[15:-1]
            else:
                try:
                    paths[icon][size] = line.split(";")[0].split("=")[-1].strip()
                except:
                    print(f"unable to load {icon}")
                    exit(-1)
with open(icons_path, "w") as fp:
    fp.write("export default {\n")
    for icon in included_icons:
        fp.write("  \"" + icon + "\": {\n")
        for key in paths[icon].keys():
            fp.write(f"    {key}: {paths[icon][key]},\n")
        fp.write("  },\n")
    fp.write("}\n")

# Get the CSS values for the font
with open(bp_css_path) as fp, open(css_path, "w") as out:
    lines = fp.readlines()
    for i, line in enumerate(lines):
        if line.startswith(".bp5-icon-") and line.endswith("::before{\n"):
            out.write(f".{line[5:]}")
            out.write(f"{lines[i+1]}")
            out.write(f"{lines[i+2]}")
