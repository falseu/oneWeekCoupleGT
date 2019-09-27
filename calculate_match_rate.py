import json
import sys

def main():
    #read_path = sys.argv[0]
    read_path = 'input.json'
    data = []
    with open(read_path, 'r') as file:
        for line in file:
            data.append(json.loads(line))

    for i in range(0, len(data)):
        p1 = data[i]
        p1_id = p1['_id']
        for j in range(0, i):
            p2 = data[j]
            p2_id = p2['_id']
            res = int((calculate(p1, p2) + calculate(p2, p1)) / 2)
            res = max(res, 0)
            p1['match'][p2_id] = res
            p2['match'][p1_id] = res
    file.close()

    with open(read_path, 'w') as file:
        for line in data:
            json.dump(line, file)
    file.close()

def calculate(p1, p2):
    res = 100
    if p1['expectedGender'] != p2['gender'] or p2['expectedGender'] != p1['gender']:
        return 0
    for i in range(3):
        if p2['merits'][i] not in p1['expectedMerits']:
            res -= 20
    if not p1['expectedAge'] == 0:
        res -= abs(p1['expectedAge'] - p2['age']) * 3
    if not p1['expectedHeight'] == 0:
        res -= abs(p1['expectedHeight'] - p2['height'])
    if not p1['expectedWeight'] == 0:
        res -= abs(p1['expectedWeight'] - p2['weight'])
    return res


if __name__ == "__main__":
    main()