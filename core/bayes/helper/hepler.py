

def get_attribute(cve: dict, attr: str, default=''):
    attrs = attr.split('.')
    val = cve
    try:
        for attribute in attrs:
            val = val[attribute]
        return val
    except:
        return default

def generate_all_binary(n, arr, i, l):
    if i == n:
        tmp = arr[:]
        l.append(tmp)
        # r_l.append(tmp)
        return
    arr[i] = 0
    generate_all_binary(n, arr, i + 1, l)
    arr[i] = 1
    generate_all_binary(n, arr, i + 1, l)

# for i in range(len(attr)):
#             attrs = attr[i].split('.')
#             for attribute in attrs:
#                 val = val[attribute]
#                 return val