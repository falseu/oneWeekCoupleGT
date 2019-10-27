import json
import sys
import operator

def main():
    #read_path = sys.argv[0]
    read_path = 'input.json'
    data = []
    match = {}

    with open(read_path, 'r') as file:
        for line in file:
            data.append(json.loads(line))

    # calculate match_rate for each pair of users
    for i in range(0, len(data)):
        p1 = data[i]
        p1_name = p1['name']
        for j in range(0, i):
            p2 = data[j]
            p2_name = p2['name']
            res = int((calculate(p1, p2) + calculate(p2, p1)) / 2)
            res = max(res, 0)
            p1['match'][p2_name] = {'rate': res, 'avatar': p2['avatarUrl']}
            p2['match'][p1_name] = {'rate': res, 'avatar': p1['avatarUrl']}
            match[(i, j)] = res

    # sort match for each user
    for i in range(0, len(data)):
        new_list = []
        for key, value in sorted(data[i]['match'].items(), key=lambda item: item[1]['rate'], reverse=True):
            value['name'] = key
            new_list.append(value)
        data[i]['match'] = new_list

    # pair the users according to match_rate
    while match:
        tup, rate = max(match.items(), key=lambda x: x[1])
        #if rate == 0: break
        i, j = tup
        p1 = data[i]
        p2 = data[j]
        p1['cp'] = p2['_openid']
        p1['cp_rate'] = rate
        p2['cp'] = p1['_openid']
        p2['cp_rate'] = rate
        p1['image_uploader'] = p1['name']
        p2['image_uploader'] = p1['name']

        # print(p1['name'], ' ', p1['cp'], rate)
        # print(p2['name'], ' ', p2['cp'], rate)

        keys = list(match.keys())
        for key in keys:
            if i in key or j in key:
                del match[key]
    
    file.close()

    with open('output.json', 'w') as file:
        for line in data:
            json.dump(line, file, indent=2, ensure_ascii=False)
    file.close()

# calculate match_rate between two users
def calculate(p1, p2):
    res = 100
    # if gender does not match, return 0
    if p1['expectedGender'] != p2['gender'] or p2['expectedGender'] != p1['gender']:
        return 0

    # each unmatched merit -10
    for i in range(3):
        if p2['merits'][i] not in p1['expectedMerits']:
            res -= 10

    #each unmatched age/weight/height -20
    if not p2['age'] in range(int(p1['expectedAgeLowerBound']), int(p1['expectedAgeUpperBound']) + 1):
        res -= 20
    if not p2['height'] in range(int(p1['expectedHeightLowerBound']), int(p1['expectedHeightUpperBound']) + 1):
        res -= 20
    if not p2['weight'] in range(int(p1['expectedWeightLowerBound']), int(p1['expectedWeightUpperBound']) + 1):
        res -= 20
    return res


if __name__ == "__main__":
    main()