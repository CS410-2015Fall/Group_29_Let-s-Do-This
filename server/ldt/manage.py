#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # # ORIGINAL
    # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ldt.settings")
    #
    # from django.core.management import execute_from_command_line
    #
    # execute_from_command_line(sys.argv)

    # FOR TEST COVERAGE
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ldt.settings")

    from django.core.management import execute_from_command_line

    is_testing = 'test' in sys.argv

    if is_testing:
        import coverage
        # see http://coverage.readthedocs.org/en/latest/cmd.html
        cov = coverage.coverage(source=['ldtserver'], branch=['true'], omit=['*/migrations/*', '*/tests/*'])
        cov.erase()
        cov.start()
        execute_from_command_line(sys.argv)
        cov.stop()
        cov.save()
        cov.report()

    else:
        execute_from_command_line(sys.argv)
