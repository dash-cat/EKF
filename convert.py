import xml.etree.ElementTree as ET
import json


with open('Аннотации.xml', encoding='utf-8') as file:
    xml_data: str = file.read()

root = ET.fromstring(xml_data)

boxes = []


for index, box in enumerate(root.findall('box')):
    box_info = {
        "id": index,
        "label": box.get("label"),
        "source": box.get("source"),
        "occluded": int(box.get("occluded")),
        "xtl": float(box.get("xtl")),
        "ytl": float(box.get("ytl")),
        "xbr": float(box.get("xbr")),
        "ybr": float(box.get("ybr")),
        
        "x": float(box.get("xtl")),
        "y": float(box.get("ytl")),
        "width": float(box.get("xbr")) - float(box.get("xtl")),
        "height": float(box.get("ybr")) - float(box.get("ytl")),
        
        
        "z_order": int(box.get("z_order")),
        "attributes": {attr.get("name"): attr.text for attr in box.findall("attribute")}
    }
    boxes.append(box_info)

# Convert the list of boxes to JSON
boxes_json = json.dumps(boxes, ensure_ascii=False, indent=2)

# Save the JSON to a file
with open('boxes.json', 'w', encoding='utf-8') as f:
    f.write(boxes_json)

print("JSON data has been saved to 'boxes.json'")
