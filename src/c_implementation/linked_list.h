//
// Created by Alw on 21/05/2022.
//

#ifndef TRIANGULATION_C_LINKED_LIST_H
#define TRIANGULATION_C_LINKED_LIST_H

#include "maths.h"

typedef struct Node {
    Triangle *val;
    struct Node *next;
} Node;

void foreach(Node **head, void (*func)(Triangle *));
void prepend(Node **head, Triangle *val);
void push(Node **head, Triangle *val);
Triangle *dequeue(Node **head);
Triangle *pop(Node **head);
Triangle *remove_by_index(Node **head, int n);
Triangle *remove_by_value(Node **head, Triangle *val);
void delete_linked_list(Node *head);
bool some(Node **head, Triangle *comp_item, bool (*func)(Triangle *, Triangle *), bool exclude_comp_item);

#endif //TRIANGULATION_C_LINKED_LIST_H
