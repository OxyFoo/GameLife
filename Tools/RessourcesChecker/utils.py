def read_file(path):
    """
    Lit un fichier et retourne son contenu.

    Args:
    path (str): Chemin vers le fichier.

    Returns:
    str: Contenu du fichier.
    """
    content = ''
    with open(path, 'r') as file:
        content = file.read()
    return content

def have_same_keys(json1, json2):
    """
    Vérifie récursivement si deux objets JSON ont les mêmes clés.

    Args:
    json1 (dict): Premier objet JSON.
    json2 (dict): Deuxième objet JSON.

    Returns:
    bool: True si les deux objets JSON ont les mêmes clés, sinon False.
    """
    if isinstance(json1, dict) and isinstance(json2, dict):
        # Vérifie si les deux dictionnaires ont les mêmes clés
        if set(json1.keys()) != set(json2.keys()):
            return False

        # Vérifie récursivement pour chaque clé
        for key in json1:
            if not have_same_keys(json1[key], json2[key]):
                return False

    elif isinstance(json1, list) and isinstance(json2, list):
        # Vérifie si les deux listes ont la même longueur
        if len(json1) != len(json2):
            return False

        # Vérifie récursivement chaque élément de la liste
        for item1, item2 in zip(json1, json2):
            if not have_same_keys(item1, item2):
                return False

    return True

def have_same_keys_js(js1, js2):
    length = len(js1)
    if length != len(js2):
        return 1

    for line in range(length):
        main_line_start = js1[line].split(':')[0]
        light_line_start = js2[line].split(':')[0]
        if main_line_start != light_line_start:
            print('[!] Line {} does not have the same start.'.format(line))
            return 2

    return 0
