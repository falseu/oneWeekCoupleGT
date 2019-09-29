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
        p1_id = p1['_id']
        for j in range(0, i):
            p2 = data[j]
            p2_id = p2['_id']
            res = int((calculate(p1, p2) + calculate(p2, p1)) / 2)
            res = max(res, 0)
            p1['match'][p2_id] = res
            p2['match'][p1_id] = res
            match[(i, j)] = res

    # TODO: pair the users according to match_rate
    while match:
    	tup, rate = max(match.items(), key=lambda x: x[1])
    	i, j = tup
    	p1 = data[i]
    	p2 = data[j]
    	p1['cp'] = p2['_openid']
    	p1['cp_rate'] = rate
    	p2['cp'] = p1['_openid']
    	p2['cp_rate'] = rate

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