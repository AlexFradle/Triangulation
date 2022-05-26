#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "linked_list.h"
#include "maths.h"

// https://www.learn-c.org/en/Linked_lists

float *make_triangulation(float points[], float point_bounds[], int number_of_points) {
    Triangle super_triangle;
    make_super_triangle(
            &super_triangle,
            point_bounds[0], point_bounds[1],
            point_bounds[2], point_bounds[3],
            point_bounds[4], point_bounds[5],
            point_bounds[6], point_bounds[7]
    );
    // print_triangle(&super_triangle);

    Node *triangulation_head = malloc(sizeof(Node));

    // https://stackoverflow.com/questions/13284033/copying-structure-in-c-with-assignment-instead-of-memcpy
    Triangle *super_triangle_copy = malloc(sizeof(Triangle));
    memcpy(super_triangle_copy, &super_triangle, sizeof(Triangle));

    triangulation_head->val = super_triangle_copy;
    triangulation_head->next = NULL;

    for (int i = 0; i < number_of_points * 2; i += 2) {
        Node *bad_triangles_head = malloc(sizeof(Node));
        bad_triangles_head->val = NULL;
        bad_triangles_head->next = NULL;

        Node *trig_current = triangulation_head;
        while (trig_current != NULL) {
            if (is_in_circumcircle(&super_triangle, trig_current->val, points[i], points[i + 1])) {
                if (bad_triangles_head->val == NULL) {
                    bad_triangles_head->val = trig_current->val;
                } else {
                    push(&bad_triangles_head, trig_current->val);
                }
            }
            trig_current = trig_current->next;
        }

        Node *current = bad_triangles_head;
        while (current != NULL) {
            // a to b
            if (!some(&bad_triangles_head, current->val, &share_a_to_b, true)) {
                Triangle *new_triangle_ab = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_ab,
                    current->val->ax, current->val->ay,
                    current->val->bx, current->val->by,
                    points[i], points[i  +1]
                );
                push(&triangulation_head, new_triangle_ab);
            }
            // b to c
            if (!some(&bad_triangles_head, current->val, &share_b_to_c, true)) {
                Triangle *new_triangle_bc = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_bc,
                    current->val->bx, current->val->by,
                    current->val->cx, current->val->cy,
                    points[i], points[i + 1]
                );
                push(&triangulation_head, new_triangle_bc);
            }
            // c to a
            if (!some(&bad_triangles_head, current->val, &share_c_to_a, true)) {
                Triangle *new_triangle_ca = malloc(sizeof(Triangle));
                construct_triangle(
                    new_triangle_ca,
                    current->val->cx, current->val->cy,
                    current->val->ax, current->val->ay,
                    points[i], points[i + 1]
                );
                push(&triangulation_head, new_triangle_ca);
            }

            // only remove node from triangulation, don't free yet because it needs to be checked in bad triangles
            remove_by_value(&triangulation_head, current->val);

            current = current->next;
        }
        delete_linked_list(bad_triangles_head, true);
    }

    Node *outer_current = triangulation_head;
    while (outer_current != NULL) {
        if (share_points(outer_current->val, &super_triangle)) {
            Triangle *temp_val = outer_current->val;
            outer_current = outer_current->next;
            free(remove_by_value(&triangulation_head, temp_val));
        } else {
            outer_current = outer_current->next;
        }
    }

    unsigned int len = length(&triangulation_head);
    float *points_arr = malloc(sizeof(float) * len * 6);
    points_arr[0] = (float) len * 6;
    int index = 1;
    Node *ll_current = triangulation_head;
    while (ll_current != NULL) {
        points_arr[index] = ll_current->val->ax;
        points_arr[index + 1] = ll_current->val->ay;
        points_arr[index + 2] = ll_current->val->bx;
        points_arr[index + 3] = ll_current->val->by;
        points_arr[index + 4] = ll_current->val->cx;
        points_arr[index + 5] = ll_current->val->cy;
        index += 6;
        ll_current = ll_current->next;
    }
    delete_linked_list(triangulation_head, true);
    return points_arr;
}

//void print_array(float **arr, int len) {
//    for (int i = 0; i < len; i++) {
//        printf("%f\n", (*arr)[i]);
//    }
//}
//
//int main() {
//    float ps[] = {120, 50, 217, 201, 165, 132, 152, 93};
//    float pbs[] = {120, 50, 120, 201, 217, 201, 217, 50};
//    float *trig_arr = make_triangulation(ps, pbs, 4);
//    print_array(&trig_arr, 12);
//    free(trig_arr);
//    return 0;
//}

